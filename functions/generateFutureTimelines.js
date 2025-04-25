import { FutureTimelinesSchema } from './schemas.js';
import { getStructuredOutput } from './getStructuredOutput.js';

export async function generateFutureTimelines(scenarioItem) {
  try {
    const timelinesPrompt = `
    Consider this step towards a positive AI scenario: "${scenarioItem}"

    Generate three potential future timelines for this step:

    * **Optimistic:** A timeline where advancements and adoption happen quickly and smoothly.
    * **Pessimistic:** A timeline where progress is slow, and challenges arise.
    * **Realistic:** A balanced timeline considering both potential advancements and likely obstacles.

    Optionally, include a "wildcard" event or breakthrough that could significantly alter any of these timelines.

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
