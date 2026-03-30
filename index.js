import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { generateTopics } from './functions/generateTopics.js';
import { getUserInput } from './functions/getUserInput.js';
import { selectTopic } from './functions/selectTopic.js';
import { selectDemo } from './functions/selectDemo.js';
import { ScenarioSchema } from './functions/schemas.js';
import { getStructuredOutput } from './functions/getStructuredOutput.js';
import { generateFutureTimelines } from './functions/generateFutureTimelines.js';
import { generateInnovation } from './functions/generateInnovation.js';
import { analyzeStakeholders } from './functions/analyzeStakeholders.js';
import { generateMarkdownForScenario } from './functions/generateMarkdownForScenario.js';
import { saveToFile } from './functions/saveToFile.js';
import { generateETA } from './functions/generateETA.js';
import { generateAnalogy } from './functions/generateAnalogy.js';
import { secureCompare } from './functions/secureCompare.js';
import { ScenarioManager } from './functions/ScenarioManager.js';
import {
  DEFAULT_PORT,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  MAX_TOPIC_LENGTH,
  AUTH_HEADER_NAME,
  DEMO_ERROR_RETRY_DELAY_MS,
  SHUTDOWN_TIMEOUT_MS,
} from './constants.js';

dotenv.config();

const app = express();
const port = process.env.PORT || DEFAULT_PORT;

// Encapsulated state management
const scenarioManager = new ScenarioManager();

// Graceful shutdown controller for demo mode
let demoAbortController = null;

console.log('--- Server Startup ---');

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:' + port,
  methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '100kb' })); // Add request size limit

// Rate Limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS
});
app.use('/api/', limiter);

// Authentication Middleware
const authenticate = (req, res, next) => {
  const adminApiKey = process.env.ADMIN_API_KEY;
  const providedKey = req.headers[AUTH_HEADER_NAME];

  if (!adminApiKey) {
    console.error('CRITICAL: ADMIN_API_KEY not configured in .env');
    return res.status(500).json({
      error: 'Server misconfiguration. Authentication not properly configured.'
    });
  }

  // Use constant-time comparison to prevent timing attacks
  if (providedKey && secureCompare(providedKey, adminApiKey)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/scenarios', (req, res) => {
  res.json(scenarioManager.getScenarios());
});

// Status endpoint for monitoring generation progress
app.get('/api/status', (req, res) => {
  res.json(scenarioManager.getStatus());
});

app.post('/api/generate', authenticate, async (req, res) => {
  // Single source of truth for generation state
  if (!scenarioManager.tryStartGeneration()) {
    return res.status(429).json({ error: 'Generation already in progress' });
  }

  const { topic } = req.body;

  // Validate topic
  if (!topic || typeof topic !== 'string') {
    scenarioManager.finishGeneration();
    return res.status(400).json({
      error: 'Invalid request. "topic" must be a non-empty string.'
    });
  }

  const trimmedTopic = topic.trim();

  if (trimmedTopic.length === 0) {
    scenarioManager.finishGeneration();
    return res.status(400).json({
      error: 'Topic cannot be empty.'
    });
  }

  if (trimmedTopic.length > MAX_TOPIC_LENGTH) {
    scenarioManager.finishGeneration();
    return res.status(400).json({
      error: `Topic must be ${MAX_TOPIC_LENGTH} characters or less.`
    });
  }

  // Start generation in background
  generateScenarios(trimmedTopic)
    .catch(err => {
      console.error('Background generation error:', err);
      scenarioManager.finishGeneration(err);
    });

  res.json({ message: 'Scenario generation started', status: 'processing' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

/**
 * Generates AI scenarios based on a given topic or user input.
 *
 * This function orchestrates the entire generation process:
 * 1. Determines the topic (from argument, CLI input, or random generation).
 * 2. Generates high-level scenarios using OpenAI.
 * 3. For each scenario item, generates detailed attributes (ETA, Analogy, Stakeholders, etc.) in parallel.
 * 4. Compiles the results into a Markdown report.
 * 5. Saves the report to a file.
 *
 * @param {string|null} [initialTopic=null] - The topic to generate scenarios for. If null, will prompt user or generate random topics.
 * @returns {Promise<void>}
 */
async function generateScenarios(initialTopic = null) {
  // If called from CLI (no initialTopic), try to acquire generation lock
  const isCliMode = !initialTopic;
  if (isCliMode && !scenarioManager.tryStartGeneration()) {
    return;
  }

  try {
    let selectedTopic = initialTopic;

    if (!selectedTopic) {
      // If running in interactive mode (CLI), ask user
      if (process.stdin.isTTY) {
        if (process.env.DEMO_MODE === 'true') {
          selectedTopic = await selectDemo();
        } else {
          selectedTopic = await getUserInput();
          if (!selectedTopic) {
            const topics = await generateTopics();
            selectedTopic = await selectTopic(topics);
          }
        }
      } else {
        console.log("Non-interactive mode: Skipping manual input.");
        return;
      }
    }

    console.log(`Generating scenario based on: ${selectedTopic}`);

    const scenariosPrompt = `Imagine a future where AI is used to create a more equitable, sustainable, and fulfilling world for everyone, focusing on the following topic: "${selectedTopic}"

Describe 3-5 detailed and distinct scenarios illustrating how AI could positively advance humanity in this ideal future, related to the given topic.

Ensure that each scenario explores a unique aspect of AI's positive potential and does not overlap significantly with other scenarios. Consider a wide range of domains where AI could have a transformative impact, such as:

- Social impact and governance
- Environmental protection and resource management
- Scientific breakthroughs and technological innovation
- Healthcare, well-being, and longevity
- Education, creativity, and self-fulfillment

Format the output as a JSON array like this:

[
  {
    "title": "Example Title 1",
    "description": "Example Description 1",
    "items": ["Item 1", "Item 2", "Item 3"]
  },
  // ... more scenarios
]

Each scenario object should include:
- "title": A short, descriptive title (maximum 20 words).
- "description": A concise explanation of the scenario (maximum 50 words).
- "items": A list of 3 to 5 specific steps or events that contribute to the scenario.
`;

    // Get the scenarios using the defined schema
    const scenariosResult = await getStructuredOutput(
      scenariosPrompt,
      ScenarioSchema
    );
    // Ensure scenarios is an array, even if only one scenario is returned
    const scenarios = Array.isArray(scenariosResult)
      ? scenariosResult
      : [scenariosResult];

    // Reset scenarios data
    scenarioManager.clearScenarios();

    // Process each scenario
    for (const scenario of scenarios) {
      console.log('Scenario:', scenario);

      // Array to store data for items within the current scenario
      const scenarioItemsData = [];

      // Process each item (step) within the scenario
      for (const item of scenario.items) {
        // Generate all item details in parallel using Promise.allSettled for resilience
        const results = await Promise.allSettled([
          generateETA(item),
          generateAnalogy(item),
          analyzeStakeholders(item),
          generateInnovation(item),
          generateFutureTimelines(item)
        ]);

        // Extract results, using null for any failed promises
        const [etaResult, analogyResult, stakeholdersResult, innovationResult, futureTimelinesResult] = results;

        const eta = etaResult.status === 'fulfilled' ? etaResult.value : { eta: 'Unable to generate' };
        const analogy = analogyResult.status === 'fulfilled' ? analogyResult.value : { event: 'N/A', similarity: 'N/A', lesson: 'N/A' };
        const stakeholders = stakeholdersResult.status === 'fulfilled' ? stakeholdersResult.value : { stakeholders: [] };
        const innovation = innovationResult.status === 'fulfilled' ? innovationResult.value : { idea: 'N/A', potential: 'N/A', challenges: 'N/A' };
        const futureTimelines = futureTimelinesResult.status === 'fulfilled' ? futureTimelinesResult.value : { optimistic: 'N/A', pessimistic: 'N/A', realistic: 'N/A' };

        // Log any failures
        results.forEach((result, idx) => {
          if (result.status === 'rejected') {
            const names = ['ETA', 'Analogy', 'Stakeholders', 'Innovation', 'FutureTimelines'];
            console.error(`Failed to generate ${names[idx]} for item "${item}":`, result.reason?.message || result.reason);
          }
        });

        console.log('  Item:', item);
        console.log('    ETA:', eta);
        console.log('    Future Timelines:', futureTimelines);
        console.log('    Analogy:', analogy);
        console.log('    Stakeholders:', stakeholders);
        console.log('    Innovation:', innovation);

        // Add the data for the current item to the scenarioItemsData array
        scenarioItemsData.push({
          item,
          eta,
          analogy,
          stakeholders: stakeholders.stakeholders,
          innovation,
          futureTimelines,
        });
      }

      // Add the scenario and its items data to the scenarios
      scenarioManager.addScenario({ scenario, items: scenarioItemsData });
    }

    let finalMarkdownContent = ''; // Initialize the final Markdown content

    // Add the main header and selected topic
    finalMarkdownContent += '# Positive Future Scenarios for AI\n\n';
    finalMarkdownContent += `Based on the topic: "${selectedTopic}"\n\n`;
    finalMarkdownContent +=
      `${scenarios.length} distinct scenarios illustrating how AI can transform humanity.\n\n`;

    // Process each scenario
    for (const { scenario, items } of scenarioManager.getScenarios()) {
      console.log('Generating Markdown for scenario:', scenario.title);

      // Generate Markdown for the current scenario
      const scenarioMarkdown = await generateMarkdownForScenario(
        scenario,
        items
      );

      // Append the scenario Markdown to the final Markdown content
      finalMarkdownContent += scenarioMarkdown;
    }

    // Save the final Markdown content to a file
    await saveToFile(finalMarkdownContent);
  } catch (error) {
    console.error('Error in generation function:', error);
    throw error; // Re-throw to allow caller to handle
  } finally {
    scenarioManager.finishGeneration();
  }
}

/**
 * Runs the demo mode loop with proper shutdown handling.
 * @param {AbortSignal} signal - Signal to abort the loop.
 */
async function runDemoLoop(signal) {
  while (!signal.aborted) {
    try {
      await generateScenarios();
      console.log('\n----------------------------------------\n');
    } catch (err) {
      console.error('Error in demo loop:', err);
      // Wait before retry, but respect abort signal
      await new Promise(resolve => {
        const timeout = setTimeout(resolve, DEMO_ERROR_RETRY_DELAY_MS);
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          resolve();
        }, { once: true });
      });
    }
  }
  console.log('Demo loop stopped.');
}

/**
 * Gracefully shuts down the server.
 */
function shutdown() {
  console.log('\nShutting down gracefully...');

  // Abort demo loop if running
  if (demoAbortController) {
    demoAbortController.abort();
  }

  if (server) {
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });

    // Force exit after timeout
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
  } else {
    process.exit(0);
  }
}

// Start server
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);

    // Trigger initial generation if running interactively
    if (process.stdin.isTTY) {
      if (process.env.DEMO_MODE === 'true') {
        // Demo mode with proper shutdown handling
        demoAbortController = new AbortController();
        runDemoLoop(demoAbortController.signal);
      } else {
        generateScenarios();
      }
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export { app, server, generateScenarios };
