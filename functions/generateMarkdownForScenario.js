/**
 * Generates a Markdown report for a complete scenario.
 * 
 * @param {object} scenario - The high-level scenario object.
 * @param {Array<object>} items - The detailed items/steps for the scenario.
 * @returns {Promise<string>} A promise that resolves to the Markdown string.
 */
export async function generateMarkdownForScenario(scenario, items) {
  let markdownContent = '';
  markdownContent += `## ${scenario.title}\n\n`;
  markdownContent += `${scenario.description}\n\n`;
  for (const { item, eta, analogy, stakeholders, innovation, futureTimelines } of items) {
    markdownContent += `### Step: ${item}\n`;
    if (eta) markdownContent += `- **ETA:** ${eta.eta}\n`;
    if (analogy) markdownContent += `- **Historical Analogy:** ${analogy.event} (${analogy.similarity})\n  - Lesson: ${analogy.lesson}\n`;
    if (stakeholders && Array.isArray(stakeholders) && stakeholders.length > 0) {
      markdownContent += `- **Stakeholders:**\n`;
      stakeholders.forEach(s => {
        markdownContent += `  - ${s.name} (${s.role}): ${s.description}\n`;
      });
    }
    if (innovation) {
      markdownContent += `- **Innovation:** ${innovation.idea}\n  - Potential: ${innovation.potential}\n  - Challenges: ${innovation.challenges}\n`;
    }
    if (futureTimelines) {
      markdownContent += `- **Future Timelines:**\n`;
      markdownContent += `  - Optimistic: ${futureTimelines.optimistic}\n`;
      markdownContent += `  - Pessimistic: ${futureTimelines.pessimistic}\n`;
      markdownContent += `  - Realistic: ${futureTimelines.realistic}\n`;
      if (futureTimelines.wildcard) markdownContent += `  - Wildcard: ${futureTimelines.wildcard}\n`;
    }
    markdownContent += '\n';
  }
  return markdownContent;
}
