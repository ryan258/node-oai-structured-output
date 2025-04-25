import { zodResponseFormat } from 'openai/helpers/zod.js';
import { openai } from './openaiClient.js';

export async function getStructuredOutput(prompt, schema = null) {
  const completion = await openai.beta.chat.completions.parse({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
    response_format: schema ? zodResponseFormat(schema, 'mySchema') : undefined,
  });
  return completion.choices[0].message.parsed;
}
