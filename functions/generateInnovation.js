import { InnovationSchema } from './schemas.js';
import { getStructuredOutput } from './getStructuredOutput.js';

/**
 * Generates a potential technological innovation related to a scenario item.
 * 
 * @param {string} item - The scenario item to inspire innovation.
 * @returns {Promise<{idea: string, potential: string, challenges: string}>} 
 *          A promise that resolves to an object containing the innovation details.
 */
export async function generateInnovation(item) {
  try {
    const innovationPrompt = `
    Consider this step towards a positive AI scenario: "${item}"

    Generate a "moonshot" idea or innovation that could significantly enhance or accelerate this step, pushing the boundaries of what's currently possible.

    Format your response as a JSON object:

    {
      "idea": "Description of the innovative idea",
      "potential": "Explanation of the potential positive impact of this innovation",
      "challenges": "Potential challenges or obstacles to realizing this innovation"
    }
    `;
    const innovation = await getStructuredOutput(
      innovationPrompt,
      InnovationSchema
    );
    return innovation;
  } catch (error) {
    console.error('Error generating innovation:', error);
    throw error;
  }
}
