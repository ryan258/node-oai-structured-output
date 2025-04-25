export async function generateMarkdownForScenario(scenario, items) {
  let markdownContent = '';
  markdownContent += `## ${scenario.title}\n\n`;
  markdownContent += `${scenario.description}\n\n`;
  for (const { item, eta, analogy, stakeholders, innovation, timelines } of items) {
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
    if (timelines) {
      markdownContent += `- **Future Timelines:**\n`;
      markdownContent += `  - Optimistic: ${timelines.optimistic}\n`;
      markdownContent += `  - Pessimistic: ${timelines.pessimistic}\n`;
      markdownContent += `  - Realistic: ${timelines.realistic}\n`;
      if (timelines.wildcard) markdownContent += `  - Wildcard: ${timelines.wildcard}\n`;
    }
    markdownContent += '\n';
  }
  return markdownContent;
}
