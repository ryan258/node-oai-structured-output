import { InnovationSchema } from './schemas.js';
import { getStructuredOutput } from './getStructuredOutput.js';

export async function generateInnovation(scenarioItem) {
  try {
    const innovationPrompt = `
    Consider this step towards a positive AI scenario: "${scenarioItem}"

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
