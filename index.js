import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


import { generateTopics } from './functions/generateTopics.js';
import { getUserInput } from './functions/getUserInput.js';
import { selectTopic } from './functions/selectTopic.js';
import { ScenarioSchema, ETASchema, AnalogySchema, StakeholdersSchema, InnovationSchema, FutureTimelinesSchema } from './functions/schemas.js';
import { getStructuredOutput } from './functions/getStructuredOutput.js';
import { generateFutureTimelines } from './functions/generateFutureTimelines.js';
import { generateInnovation } from './functions/generateInnovation.js';
import { analyzeStakeholders } from './functions/analyzeStakeholders.js';
import { generateMarkdownForScenario } from './functions/generateMarkdownForScenario.js';
import { saveToFile } from './functions/saveToFile.js';
import { generateETA } from './functions/generateETA.js';
import { generateAnalogy } from './functions/generateAnalogy.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
let allScenariosData = [];
let isGenerating = false;

console.log('--- Server Startup ---');


// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Authentication Middleware
const authenticate = (req, res, next) => {
  const adminApiKey = process.env.ADMIN_API_KEY;
  const providedKey = req.headers['x-admin-key'];

  if (!adminApiKey) {
    console.error('CRITICAL: ADMIN_API_KEY not configured in .env');
    return res.status(500).json({
      error: 'Server misconfiguration. Authentication not properly configured.'
    });
  }

  if (providedKey && providedKey === adminApiKey) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/scenarios', (req, res) => {
  res.json(allScenariosData);
});

app.post('/api/generate', authenticate, async (req, res) => {
  if (isGenerating) {
    return res.status(429).json({ error: 'Generation already in progress' });
  }

  const { topic } = req.body;

  // Validate topic
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({
      error: 'Invalid request. "topic" must be a non-empty string.'
    });
  }

  const trimmedTopic = topic.trim();

  if (trimmedTopic.length === 0) {
    return res.status(400).json({
      error: 'Topic cannot be empty.'
    });
  }

  if (trimmedTopic.length > 500) {
    return res.status(400).json({
      error: 'Topic must be 500 characters or less.'
    });
  }

  // Set flag immediately to prevent race conditions
  isGenerating = true;

  // Start generation in background
  generateScenarios(trimmedTopic)
    .catch(err => console.error('Background generation error:', err))
    .finally(() => {
      isGenerating = false;
    });

  res.json({ message: 'Scenario generation started', status: 'processing' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function generateScenarios(initialTopic = null) {
  // isGenerating check removed here as it is handled in the route handler
  // However, we keep the flag management in case this is called internally
  if (isGenerating && initialTopic === null && process.stdin.isTTY) {
    // If called from CLI and already generating, just return.
    // But if called from API, the flag is already set true by the handler.
    // We need to be careful not to double-set or early return if it was just set by the handler.
    // Since the handler sets it true, we should assume if we are here, we are good to go unless
    // we want to be extra safe.
    // For simplicity, let's rely on the handler's check for API calls.
    // For CLI calls, we can check.
  }

  // If called from CLI (no initialTopic), set flag.
  // If called from API (initialTopic present), flag is already set.
  if (!initialTopic) {
    if (isGenerating) return;
    isGenerating = true;
  }

  try {
    let selectedTopic = initialTopic;

    if (!selectedTopic) {
      // If running in interactive mode (CLI), ask user
      // Note: This might block if triggered via API without topic, but API should provide topic
      // For initial startup, we can still use CLI input
      if (process.stdin.isTTY) {
        selectedTopic = await getUserInput();
        if (!selectedTopic) {
          const topics = await generateTopics();
          selectedTopic = await selectTopic(topics);
        }
      } else {
        console.log("Non-interactive mode: Skipping manual input.");
        isGenerating = false;
        return;
      }
    }

    console.log(`Generating scenario based on: ${selectedTopic}`);

    // Modify the scenarios prompt to include the selected topic
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

    // Reset allScenariosData
    allScenariosData = [];

    // Process each scenario 
    for (const scenario of scenarios) {
      console.log('Scenario:', scenario);

      // Array to store data for items within the current scenario
      const scenarioItemsData = [];

      // Process each item (step) within the scenario 
      for (const item of scenario.items) {
        // Generate all item details in parallel
        const [eta, analogy, stakeholders, innovation, futureTimelines] = await Promise.all([
          generateETA(item),
          generateAnalogy(item),
          analyzeStakeholders(item),
          generateInnovation(item),
          generateFutureTimelines(item)
        ]);

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

      // Add the scenario and its items data to the allScenariosData array
      allScenariosData.push({ scenario, items: scenarioItemsData });
    }

    let finalMarkdownContent = ''; // Initialize the final Markdown content

    // Add the main header and selected topic
    finalMarkdownContent += '# Positive Future Scenarios for AI\n\n';
    finalMarkdownContent += `Based on the topic: "${selectedTopic}"\n\n`;
    finalMarkdownContent +=
      `${scenarios.length} distinct scenarios illustrating how AI can transform humanity.\n\n`;

    // Process each scenario 
    for (const { scenario, items } of allScenariosData) {
      console.log('Generating Markdown for scenario:', scenario.title); // Log the scenario being processed

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
  } finally {
    isGenerating = false;
  }
}

// Start server immediately
// Start server immediately
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);

    // Trigger initial generation if running interactively
    if (process.stdin.isTTY) {
      generateScenarios();
    }
  });
}

export { app, server };
