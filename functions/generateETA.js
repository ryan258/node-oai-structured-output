import { ETASchema } from './schemas.js';
import { getStructuredOutput } from './getStructuredOutput.js';

export async function generateETA(item) {
  try {
    const etaPrompt = `Consider the following step towards a positive AI scenario: "${item}"

Provide your best estimate for when this step could be realized, considering current technological trends and potential advancements.

Format your response as a JSON object with this structure:
{
  "eta": "Concise sentence describing the estimated timeline."
}
Be specific and provide a realistic timeframe whenever possible (e.g., "Within the next 5 years," "By the early 2030s," "Likely beyond 2050"). If the timeframe is highly uncertain, acknowledge the uncertainty and explain why.`;
    const eta = await getStructuredOutput(etaPrompt, ETASchema);
    return eta;
  } catch (error) {
    console.error('Error generating ETA:', error);
    throw error;
  }
}
