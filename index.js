import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import fs from 'fs';

// Load environment variables from .env file 🤫
dotenv.config();

// Initialize the OpenAI API client 🚀
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define Zod schemas for structured outputs from the OpenAI API 📋

// Schema for the initial AI scenarios (positive in this case) 
const ScenarioSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string()),
});

// Schema for the estimated timeline (ETA) ⏱️
const ETASchema = z.object({
  eta: z.string(),
});

// Schema for the historical analogy 🏛️
const AnalogySchema = z.object({
  event: z.string(),
  similarity: z.string(),
  lesson: z.string(),
});

// Schema for Stakeholder (Individual Stakeholder) 👤
const StakeholderSchema = z.object({
  name: z.string(), 
  role: z.string(), 
});

// Schema for Stakeholder Analysis (List of Stakeholders) 👥
const StakeholdersSchema = z.object({
  stakeholders: z.array(StakeholderSchema), // Now StakeholderSchema is defined
});

// Function to get structured output from the OpenAI API 🤖
// It can optionally use a Zod schema for validation and parsing
async function getStructuredOutput(prompt, schema = null) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      response_format: schema ? zodResponseFormat(schema, 'mySchema') : undefined, // Use schema if provided
    });

    return completion.choices[0].message.parsed;
  } catch (error) {
    console.error("Error getting structured output from OpenAI:", error); 
    throw error; // Re-throw the error to be handled at a higher level
  }
}

// Function to generate Markdown content using an AI agent ✍️
async function generateMarkdown(scenariosData) {
  try {
    const markdownPrompt = `
    Format the following positive and ideal AI scenario data as a Markdown document:

    ${JSON.stringify(scenariosData)}

    Make sure to use headings for scenarios and items, and clearly present the ETA, historical analogy, and stakeholder analysis for each item.
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
  } catch (error) {
    console.error("Error generating Markdown from OpenAI:", error);
    throw error;
  }
}

// Function to save content to a file with a timestamp in the filename 💾
// in a /logs directory
async function saveToFile(content) {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const filename = `ai_positive_scenarios_${timestamp}.md`; 
  const directory = './logs'; 

  // Create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  try {
    await fs.promises.writeFile(`${directory}/${filename}`, content);
    console.log(`File '${filename}' saved to '${directory}' directory! 🎉`);
  } catch (err) {
    console.error(`Error writing to file '${filename}':`, err);
  }
}

// Function to perform stakeholder analysis for a scenario item 👥
async function analyzeStakeholders(scenarioItem) {
  try {
    const stakeholderPrompt = `
    Identify key stakeholders who would be significantly affected by the following AI scenario step: "${scenarioItem}"

    Consider governments, businesses, individuals, specific communities, or other relevant groups.

    Format your response as a JSON array of stakeholder objects:

    [
      {
        "name": "Name or type of stakeholder",
        "role": "Role of the stakeholder (e.g., Beneficiary, Regulator, Developer)"
      },
      // ... more stakeholders
    ]
    `;

    const stakeholders = await getStructuredOutput(stakeholderPrompt, StakeholdersSchema); // Use the updated schema
    return stakeholders.stakeholders; // Access the array from the response object
  } catch (error) {
    console.error("Error analyzing stakeholders:", error);
    throw error;
  }
}

// Function to generate ETA for the item ⏱️
async function generateETA(item) {
  try {
    const etaPrompt = `Consider the following step towards a positive AI scenario: "${item}"

    Provide your best estimate for when this step could be realized, considering current technological trends and potential advancements. 
    
    Format your response as a JSON object with this structure:
    
    {
      "eta": "Concise sentence describing the estimated timeline." 
    }
    
    Be specific and provide a realistic timeframe whenever possible (e.g., "Within the next 5 years," "By the early 2030s," "Likely beyond 2050"). If the timeframe is highly uncertain, acknowledge the uncertainty and explain why.
    `;
    const eta = await getStructuredOutput(etaPrompt, ETASchema); 
    return eta;
  } catch (error) {
    console.error("Error generating ETA:", error);
    throw error;
  }
}


// Function to generate historical analogy for the item 🏛️
async function generateAnalogy(item) {
  try {
    const analogyPrompt = `Consider this step towards a positive AI scenario: "${item}"

Provide a historical analogy that highlights a similar advancement or event that had a significant positive impact on humanity.

Format your response as a JSON object with this structure:

{
  "event": "Name or brief description of the historical event",
  "similarity": "Explanation of the key similarities between the historical event and the AI scenario step",
  "lesson": "A valuable lesson or insight that can be drawn from the historical event and applied to the AI scenario"
}

Focus on analogies that:
- Demonstrate the potential positive impact of technological advancements.
- Highlight the importance of careful planning, ethical considerations, and societal adaptation.
- Offer valuable lessons for navigating the challenges and opportunities of the AI scenario.
`;
    const analogy = await getStructuredOutput(analogyPrompt, AnalogySchema); 
    return analogy;
  } catch (error) {
    console.error("Error generating analogy:", error);
    throw error;
  }
}


// Main function (the orchestrator) 🎬
async function main() {
  try {
    // Prompt for generating positive AI scenarios 💭
    const scenariosPrompt = `Imagine a future where AI is used to create a more equitable, sustainable, and fulfilling world for everyone. 

Describe 5 detailed and distinct scenarios illustrating how AI could positively advance humanity in this ideal future. 

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
    const scenariosResult = await getStructuredOutput(scenariosPrompt, ScenarioSchema);
    // Ensure scenarios is an array, even if only one scenario is returned
    const scenarios = Array.isArray(scenariosResult) ? scenariosResult : [scenariosResult];

    // Array to store data for all scenarios 📚
    const allScenariosData = [];

    // Process each scenario 🔄
    for (const scenario of scenarios) {
      console.log("Scenario:", scenario);

      // Process each item (step) within the scenario 🔍
      for (const item of scenario.items) {
        // Generate ETA for the item ⏱️
        const eta = await generateETA(item);

        // Generate historical analogy for the item 🏛️
        const analogy = await generateAnalogy(item);

        // Stakeholder Analysis 👥
        const stakeholders = await analyzeStakeholders(item);

        console.log("  Item:", item);
        console.log("    ETA:", eta);
        console.log("    Analogy:", analogy);
        console.log("    Stakeholders:", stakeholders);

        // Add the data for the current scenario to the array 📝
        allScenariosData.push({ scenario, eta, analogy, stakeholders });
      }
    }

    // Generate Markdown content using the AI agent ✍️
    const markdownContent = await generateMarkdown(allScenariosData);

    // Save the Markdown content to a file 💾
    await saveToFile(markdownContent);

  } catch (error) {
    console.error("Error in main function:", error); 
  }
}

// Run the main function (start the show!) 🎬
main();