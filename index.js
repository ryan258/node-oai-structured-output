import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define Zod schemas for structured outputs from the OpenAI API

// Schema for the initial AI doom scenarios
const ScenarioSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string()),
});

// Schema for the estimated timeline (ETA)
const ETASchema = z.object({
  eta: z.string(),
});

// Schema for the historical analogy
const AnalogySchema = z.object({
  event: z.string(),
  similarity: z.string(),
  lesson: z.string(),
});

// Function to get structured output from the OpenAI API
// It can optionally use a Zod schema for validation and parsing
async function getStructuredOutput(prompt, schema = null) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    response_format: schema ? zodResponseFormat(schema, 'mySchema') : undefined, // Use schema if provided
  });

  return completion.choices[0].message.parsed;
}

// Function to generate Markdown content using an AI agent
async function generateMarkdown(scenariosData) {
  const markdownPrompt = `
  Format the following AI doom scenario data as a Markdown document:

  ${JSON.stringify(scenariosData)}

  Make sure to use headings for scenarios and items, and clearly present the ETA and historical analogy for each item.
  `;

  // Get the Markdown output from the AI agent (no schema needed here)
  const completion = await openai.chat.completions.create({ 
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: markdownPrompt },
    ],
  });

  // Access and return the raw text content 
  const markdownContent = completion.choices[0].message.content;
  return markdownContent;
}

// Function to save content to a file with a timestamp in the filename
// in a /logs directory
async function saveToFile(content) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `ai_doom_scenarios_${timestamp}.md`;
  const directory = './logs'; // Directory to save the files

  // Create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  try {
    await fs.promises.writeFile(`${directory}/${filename}`, content);
    console.log(`File '${filename}' saved to '${directory}' directory!`);
  } catch (err) {
    console.error(`Error writing to file '${filename}':`, err);
  }
}

// Main function
async function main() {
  try {
    // Prompt for generating AI doom scenarios
    const scenariosPrompt = `Generate a list of 3 ways AI could doom humanity, formatted as a JSON object with the following fields: 
      - title (a short, descriptive title for each scenario)
      - description (a brief explanation of the scenario)
      - items (a list of specific steps or events that contribute to the scenario).`;

    // Get the scenarios using the defined schema
    const scenariosResult = await getStructuredOutput(scenariosPrompt, ScenarioSchema);
    // Ensure scenarios is an array, even if only one scenario is returned
    const scenarios = Array.isArray(scenariosResult) ? scenariosResult : [scenariosResult];

    // Array to store data for all scenarios
    const allScenariosData = [];

    // Process each scenario
    for (const scenario of scenarios) {
      console.log("Scenario:", scenario);

      // Declare eta and analogy variables in the outer loop scope
      let eta;
      let analogy;

      // Process each item (step) within the scenario
      for (const item of scenario.items) {
        // Generate ETA for the item
        const etaPrompt = `Considering this step towards an AI doom scenario: "${item}", provide an estimated timeline (ETA) for its potential realization in a concise sentence, and format it as a JSON object with a top-level key named 'eta'.`;
        eta = await getStructuredOutput(etaPrompt, ETASchema);

        // Generate historical analogy for the item
        const analogyPrompt = `Provide a historical analogy for this step towards an AI doom scenario: "${item}". Output a JSON object with the 'event', a description of the 'similarity', and a potential 'lesson' learned from the historical event.`;
        analogy = await getStructuredOutput(analogyPrompt, AnalogySchema);

        console.log("  Item:", item);
        console.log("    ETA:", eta);
        console.log("    Analogy:", analogy);

        // Add the data for the current scenario to the array
        allScenariosData.push({ scenario, eta, analogy });
      }
    }

    // Generate Markdown content using the AI agent
    const markdownContent = await generateMarkdown(allScenariosData);

    // Save the Markdown content to a file
    await saveToFile(markdownContent);

  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the main function
main();