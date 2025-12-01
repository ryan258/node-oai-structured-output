import { zodResponseFormat } from 'openai/helpers/zod.js';
import { openai } from './openaiClient.js';

export async function getStructuredOutput(prompt, schema = null) {
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
    response_format: schema ? zodResponseFormat(schema, 'mySchema') : undefined,
  });
  return completion.choices[0].message.parsed;
}
