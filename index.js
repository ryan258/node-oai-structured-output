import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define your schema
const MySchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string())
});

// Function to get structured output
async function getStructuredOutput(prompt) {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(MySchema, "mySchema"),
  });

  return completion.choices[0].message.parsed;
}

// Main function
async function main() {
  try {
    const result = await getStructuredOutput(`Generate a list of 3 ways AI could doom humanity, formatted as a JSON object with the following fields: 
      - title (a short, descriptive title for each scenario)
      - description (a brief explanation of the scenario)
      - items (a list of specific steps or events that contribute to the scenario).`);
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();