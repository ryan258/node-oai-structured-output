import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for the initial scenario generation
const ScenarioSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string()),
});

// Schema for the evaluator's output (ETA)
const ETASchema = z.object({
  eta: z.string(),
});


async function getStructuredOutput(prompt, schema) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(schema, 'mySchema'),
  });

  return completion.choices[0].message.parsed;
}

async function main() {
  try {
    const scenariosPrompt = `Generate a list of 3 ways AI could doom humanity, formatted as a JSON object with the following fields: 
      - title (a short, descriptive title for each scenario)
      - description (a brief explanation of the scenario)
      - items (a list of specific steps or events that contribute to the scenario).`;

    const scenariosResult = await getStructuredOutput(scenariosPrompt, ScenarioSchema);

    // Convert single scenario object to an array if necessary
    const scenarios = Array.isArray(scenariosResult) ? scenariosResult : [scenariosResult];

    for (const scenario of scenarios) {
      const etaPrompt = `Considering the following AI doom scenario: "${scenario.description}", provide an estimated timeline (ETA) for its potential realization in a concise sentence, and format it as a JSON object with a top-level key named 'eta'.`;

      const eta = await getStructuredOutput(etaPrompt, ETASchema);
      console.log("Scenario:", scenario);
      console.log("ETA:", eta);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();