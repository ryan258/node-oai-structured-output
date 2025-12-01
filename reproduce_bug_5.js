import { generateMarkdownForScenario } from './functions/generateMarkdownForScenario.js';

const mockScenario = {
  title: "Test Scenario",
  description: "A test scenario description."
};

const mockItems = [
  {
    item: "Step 1",
    eta: { eta: "2030" },
    analogy: { event: "Industrial Revolution", similarity: "High", lesson: "Adapt" },
    stakeholders: [{ name: "Public", role: "Beneficiary", description: "Everyone" }],
    innovation: { idea: "AI Fusion", potential: "Huge", challenges: "Safety" },
    futureTimelines: { // Note: The key here is futureTimelines, matching the data structure in index.js
      optimistic: "Great",
      pessimistic: "Bad",
      realistic: "Okay",
      wildcard: "Aliens"
    }
  }
];

async function test() {
  try {
    console.log("Testing generateMarkdownForScenario...");
    const markdown = await generateMarkdownForScenario(mockScenario, mockItems);
    console.log("Result:");
    console.log(markdown);
    
    if (markdown.includes("Future Timelines")) {
        console.log("SUCCESS: Future Timelines found in markdown.");
    } else {
        console.log("FAILURE: Future Timelines NOT found in markdown (likely due to variable mismatch).");
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

test();
