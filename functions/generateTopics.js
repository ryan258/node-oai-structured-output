import { z } from 'zod';
import { getStructuredOutput } from './getStructuredOutput.js';

export async function generateTopics() {
  const topicsPrompt = `Generate 10 diverse and interesting AI scenario topics for positive future outcomes. Each topic should be a brief phrase or sentence.`;
  const topicsSchema = z.object({
    topics: z.array(z.string()),
  });
  const topics = await getStructuredOutput(topicsPrompt, topicsSchema);
  return topics.topics;
}
