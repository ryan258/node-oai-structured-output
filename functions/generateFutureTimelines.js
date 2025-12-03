import { FutureTimelinesSchema } from './schemas.js';
import { getStructuredOutput } from './getStructuredOutput.js';

/**
 * Generates optimistic, pessimistic, and realistic timelines for a scenario item.
 * 
 * @param {string} item - The scenario item to project.
 * @returns {Promise<{optimistic: string, pessimistic: string, realistic: string, wildcard?: string}>} 
 *          A promise that resolves to an object containing the future timelines.
 */
export async function generateFutureTimelines(item) {
  try {
    const timelinesPrompt = `
    Consider this step towards a positive AI scenario: "${item}"

    Generate three potential future timelines for this step:

    * **Optimistic:** A timeline where everything goes right, leading to the best possible outcome.
    * **Pessimistic:** A timeline where challenges arise and things go wrong.
    * **Realistic:** A balanced timeline considering both potential success and failure.

    Optionally, include a "wildcard" timeline if there's a high-impact, low-probability event that could drastically change the outcome.

    Format your response as a JSON object:
    {
      "optimistic": "Description of the optimistic timeline",
      "pessimistic": "Description of the pessimistic timeline",
      "realistic": "Description of the realistic timeline",
      "wildcard": "Description of a potential wildcard event (optional)"
    }
`;
    const timelines = await getStructuredOutput(
      timelinesPrompt,
      FutureTimelinesSchema
    );
    return timelines;
  } catch (error) {
    console.error('Error generating future timelines:', error);
    throw error;
  }
}
