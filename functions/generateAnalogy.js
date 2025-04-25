import { AnalogySchema } from './schemas.js';
import { getStructuredOutput } from './getStructuredOutput.js';

export async function generateAnalogy(item) {
  try {
    const analogyPrompt = `Consider this step towards a positive AI scenario: "${item}"

Provide a historical analogy that highlights a similar advancement or event that had a significant positive impact on humanity.

Format your response as a JSON object with this structure:
{
  "event": "Name or brief description of the historical event",
  "similarity": "Explanation of the key similarities between the historical event and the AI scenario step",
  "lesson": "A valuable lesson or insight that can be drawn from the historical event and applied to the AI scenario"
}
Focus on analogies that:
- Demonstrate the potential positive impact of technological advancements.
- Highlight the importance of careful planning, ethical considerations, and societal adaptation.
- Offer valuable lessons for navigating the challenges and opportunities of the AI scenario.`;
    const analogy = await getStructuredOutput(analogyPrompt, AnalogySchema);
    return analogy;
  } catch (error) {
    console.error('Error generating analogy:', error);
    throw error;
  }
}
