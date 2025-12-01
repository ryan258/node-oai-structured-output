import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
// import fs from 'fs';

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

app.get('/api/scenarios', (req, res) => {
  res.json(allScenariosData);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'index.html'));
});

async function main() {
  try {
    let selectedTopic = await getUserInput();

    if (!selectedTopic) {
      const topics = await generateTopics();
      selectedTopic = await selectTopic(topics);
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
        // Generate ETA for the item 
        const eta = await generateETA(item);

        // Generate historical analogy for the item 
        const analogy = await generateAnalogy(item);

        // Stakeholder Analysis 
        const stakeholders = await analyzeStakeholders(item);

        // Generate Innovation 
        const innovation = await generateInnovation(item);

        // Generate Future Timelines 
        const futureTimelines = await generateFutureTimelines(item);

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
    console.error('Error in main function:', error);
  }

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

main();
