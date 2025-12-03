import { zodResponseFormat } from 'openai/helpers/zod.js';
import { openai } from './openaiClient.js';

/**
 * Helper function to get structured JSON output from OpenAI.
 * 
 * @param {string} prompt - The prompt to send to the model.
 * @param {object} schema - The Zod schema to validate the response against.
 * @param {string} [schemaName='mySchema'] - The name of the schema for the response format.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON object.
 */
export async function getStructuredOutput(prompt, schema = null, schemaName = 'mySchema') {
  // Get model from environment, with different defaults based on provider
  const defaultModel = process.env.USE_OPENROUTER === 'true'
    ? 'openai/gpt-4o-mini'  // OpenRouter requires provider prefix
    : 'gpt-4o-mini';

  const model = process.env.AI_MODEL || defaultModel;

  const completion = await openai.beta.chat.completions.parse({
    model,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    response_format: schema ? zodResponseFormat(schema, schemaName) : undefined,
  });
  return completion.choices[0].message.parsed;
}
