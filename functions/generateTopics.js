import { z } from 'zod';
import { getStructuredOutput } from './getStructuredOutput.js';

/**
 * Generates a list of diverse AI scenario topics.
 *
 * Uses OpenAI to generate 10 distinct topics focusing on positive future outcomes.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of 10 topic strings.
 */
export async function generateTopics() {
  try {
    const topicsPrompt = `Generate 10 diverse and interesting AI scenario topics for positive future outcomes. Each topic should be a brief phrase or sentence.`;
    const topicsSchema = z.object({
      topics: z.array(z.string()),
    });
    const topics = await getStructuredOutput(topicsPrompt, topicsSchema);
    return topics.topics;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
}
