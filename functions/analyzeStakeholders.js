import { StakeholdersSchema } from './schemas.js';
import { getStructuredOutput } from './getStructuredOutput.js';

/**
 * Identifies and analyzes key stakeholders for a scenario item.
 * 
 * @param {string} scenarioItem - The scenario item to analyze.
 * @returns {Promise<{stakeholders: Array<{name: string, role: string, description: string}>}>} 
 *          A promise that resolves to an object containing an array of stakeholder objects.
 */
export async function analyzeStakeholders(scenarioItem) {
  try {
    const stakeholdersPrompt = `
    Consider this step towards a positive AI scenario: "${scenarioItem}"
    Identify the key stakeholders who would be affected by this step. For each stakeholder, provide:
    - name
    - role
    - a brief description of their interest or involvement
    Format your response as a JSON object:
    {
      "stakeholders": [
        { "name": "...", "role": "...", "description": "..." },
        ...
      ]
    }
    `;
    const stakeholders = await getStructuredOutput(
      stakeholdersPrompt,
      StakeholdersSchema
    );
    return stakeholders;
  } catch (error) {
    console.error('Error analyzing stakeholders:', error);
    throw error;
  }
}
