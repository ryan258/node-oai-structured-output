import dotenv from 'dotenv'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import fs from 'fs'
import express from 'express'
import path from 'path'
import readline from 'readline'

// Load environment variables from .env file 🤫
dotenv.config()

// Add Express
const app = express()
const port = 3003 // You can choose any available port

// Define allScenariosData as a global variable
let allScenariosData = []

// API endpoint to serve scenario data
app.get('/api/scenarios', (req, res) => {
  res.json(allScenariosData)
})

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'index.html'))
})

// Initialize the OpenAI API client 🚀
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define Zod schemas for structured outputs from the OpenAI API 📋

// Schema for the initial AI scenarios (positive in this case)
const ScenarioSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(z.string()),
})

// Schema for the estimated timeline (ETA) ⏱️
const ETASchema = z.object({
  eta: z.string(),
})

// Schema for the historical analogy 🏛️
const AnalogySchema = z.object({
  event: z.string(),
  similarity: z.string(),
  lesson: z.string(),
})

// Schema for Stakeholder (Individual Stakeholder) 👤 (Updated)
const StakeholderSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string(), // Add description property
})

// Schema for Stakeholder Analysis (List of Stakeholders) 👥
const StakeholdersSchema = z.object({
  stakeholders: z.array(StakeholderSchema),
})

// Schema for Innovation (from The Innovator agent) 💡
const InnovationSchema = z.object({
  idea: z.string(),
  potential: z.string(),
  challenges: z.string(),
})

// Schema for Future Timelines (from The Futurist agent) 🔮
const FutureTimelinesSchema = z.object({
  optimistic: z.string(),
  pessimistic: z.string(),
  realistic: z.string(),
  wildcard: z.string().optional(), // Optional wildcard event
})

// Function to generate future timelines for a scenario item 🔮
async function generateFutureTimelines(scenarioItem) {
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
    `

    const timelines = await getStructuredOutput(
      timelinesPrompt,
      FutureTimelinesSchema
    )
    return timelines
  } catch (error) {
    console.error('Error generating future timelines:', error)
    throw error
  }
}

// Function to generate innovative ideas for a scenario item 💡
async function generateInnovation(scenarioItem) {
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
    `

    const innovation = await getStructuredOutput(
      innovationPrompt,
      InnovationSchema
    )
    return innovation
  } catch (error) {
    console.error('Error generating innovation:', error)
    throw error
  }
}

// Function to get structured output from the OpenAI API 🤖
// It can optionally use a Zod schema for validation and parsing
async function getStructuredOutput(prompt, schema = null) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      response_format: schema
        ? zodResponseFormat(schema, 'mySchema')
        : undefined, // Use schema if provided
    })

    return completion.choices[0].message.parsed
  } catch (error) {
    console.error('Error getting structured output from OpenAI:', error)
    throw error // Re-throw the error to be handled at a higher level
  }
}

// Function to generate Markdown content for a single scenario ✍️
async function generateMarkdownForScenario(scenario, items) {
  try {
    let markdownContent = ''

    markdownContent += `## ${scenario.title}\n\n`
    markdownContent += `${scenario.description}\n\n`

    // Iterate through each item within the scenario
    for (const {
      item,
      eta,
      analogy,
      stakeholders,
      innovation,
      futureTimelines,
    } of items) {
      markdownContent += `### ${item}\n\n`
      markdownContent += `**ETA:** ${eta.eta}\n\n`

      // Add Future Timelines section 🔮
      markdownContent += `**Future Timelines:**\n\n`
      markdownContent += `- **Optimistic:** ${futureTimelines.optimistic}\n`
      markdownContent += `- **Pessimistic:** ${futureTimelines.pessimistic}\n`
      markdownContent += `- **Realistic:** ${futureTimelines.realistic}\n`
      if (futureTimelines.wildcard) {
        markdownContent += `- **Wildcard Event:** ${futureTimelines.wildcard}\n`
      }
      markdownContent += '\n'

      markdownContent += `**Historical Analogy:**\n\n`
      markdownContent += `- **Event:** ${analogy.event}\n`
      markdownContent += `- **Similarity:** ${analogy.similarity}\n`
      markdownContent += `- **Lesson:** ${analogy.lesson}\n\n`

      markdownContent += `**Stakeholders:**\n\n`
      for (const stakeholder of stakeholders) {
        markdownContent += `- **${stakeholder.name}:** ${stakeholder.role} - ${stakeholder.description}\n`
      }
      markdownContent += '\n'

      // Add Innovation section 💡
      markdownContent += `**Innovation - Moonshot Idea:**\n\n`
      markdownContent += `${innovation.idea}\n\n`
      markdownContent += `**Potential Impact:** ${innovation.potential}\n\n`
      markdownContent += `**Challenges:** ${innovation.challenges}\n\n`
    }

    return markdownContent
  } catch (error) {
    console.error('Error generating Markdown from OpenAI:', error)
    throw error
  }
}

// Function to save content to a file with a timestamp in the filename 💾
// in a /logs directory
async function saveToFile(content) {
  const timestamp = new Date().toISOString().replace(/:/g, '-')
  const filename = `ai_positive_scenarios_${timestamp}.md`
  const directory = './logs'

  // Create the directory if it doesn't exist
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  try {
    await fs.promises.writeFile(`${directory}/${filename}`, content)
    console.log(`File '${filename}' saved to '${directory}' directory! 🎉`)
  } catch (err) {
    console.error(`Error writing to file '${filename}':`, err)
  }
}

// New function to generate topics
async function generateTopics() {
  const topicsPrompt = `Generate 10 diverse and interesting AI scenario topics for positive future outcomes. Each topic should be a brief phrase or sentence.`

  const topicsSchema = z.object({
    topics: z.array(z.string()),
  })

  const topics = await getStructuredOutput(topicsPrompt, topicsSchema)
  return topics.topics
}

// New function to get user input
async function getUserInput() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(
      'Enter a scenario prompt (or press Enter for AI-generated topics): ',
      (input) => {
        rl.close()
        resolve(input.trim())
      }
    )
  })
}

// New function to select a topic
async function selectTopic(topics) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log('Select a topic by entering its number (0-9):')
  topics.forEach((topic, index) => {
    console.log(`${index}: ${topic}`)
  })

  return new Promise((resolve) => {
    rl.question('Your selection: ', (input) => {
      rl.close()
      const selectedIndex = parseInt(input)
      if (selectedIndex >= 0 && selectedIndex < topics.length) {
        resolve(topics[selectedIndex])
      } else {
        console.log('Invalid selection. Using the first topic.')
        resolve(topics[0])
      }
    })
  })
}

// Function to perform stakeholder analysis for a scenario item 👥
async function analyzeStakeholders(scenarioItem) {
  try {
    const stakeholderPrompt = `
    Identify up to 5 key stakeholders who would be significantly affected by the following AI scenario step: "${scenarioItem}"

    Consider governments, businesses, individuals, specific communities, or other relevant groups.

    Format your response as a JSON object with an array of stakeholder objects:

    {
      "stakeholders": [
        {
          "name": "Name or type of stakeholder",
          "role": "Role of the stakeholder (e.g., Beneficiary, Regulator, Developer)",
          "description": "Brief description of the stakeholder's role in this specific scenario" 
        },
        // ... more stakeholders (up to 5)
      ]
    }
    `

    const stakeholders = await getStructuredOutput(
      stakeholderPrompt,
      StakeholdersSchema
    )
    return stakeholders.stakeholders
  } catch (error) {
    console.error('Error analyzing stakeholders:', error)
    throw error
  }
}

// Function to generate ETA for the item ⏱️
async function generateETA(item) {
  try {
    const etaPrompt = `Consider the following step towards a positive AI scenario: "${item}"

    Provide your best estimate for when this step could be realized, considering current technological trends and potential advancements. 
    
    Format your response as a JSON object with this structure:
    
    {
      "eta": "Concise sentence describing the estimated timeline." 
    }
    
    Be specific and provide a realistic timeframe whenever possible (e.g., "Within the next 5 years," "By the early 2030s," "Likely beyond 2050"). If the timeframe is highly uncertain, acknowledge the uncertainty and explain why.
    `
    const eta = await getStructuredOutput(etaPrompt, ETASchema)
    return eta
  } catch (error) {
    console.error('Error generating ETA:', error)
    throw error
  }
}

// Function to generate historical analogy for the item 🏛️
async function generateAnalogy(item) {
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
- Offer valuable lessons for navigating the challenges and opportunities of the AI scenario.
`
    const analogy = await getStructuredOutput(analogyPrompt, AnalogySchema)
    return analogy
  } catch (error) {
    console.error('Error generating analogy:', error)
    throw error
  }
}

// Updated main function
async function main() {
  try {
    let selectedTopic = await getUserInput()

    if (!selectedTopic) {
      const topics = await generateTopics()
      selectedTopic = await selectTopic(topics)
    }

    console.log(`Generating scenario based on: ${selectedTopic}`)

    // Modify the scenarios prompt to include the selected topic
    const scenariosPrompt = `Imagine a future where AI is used to create a more equitable, sustainable, and fulfilling world for everyone, focusing on the following topic: "${selectedTopic}" 

Describe 2 detailed and distinct scenarios illustrating how AI could positively advance humanity in this ideal future, related to the given topic. 

Ensure that each scenario explores a unique aspect of AI's positive potential and does not overlap significantly with other scenarios. Consider a wide range of domains where AI could have a transformative impact, such as:

- Social impact and governance
- Environmental protection and resource management
- Scientific breakthroughs and technological innovation
- Healthcare, well-being, and longevity
- Education, creativity, and self-fulfillment

Format the output as a JSON array like this:

[
  {
    "title": "Example Title 1", 
    "description": "Example Description 1", 
    "items": ["Item 1", "Item 2", "Item 3"]
  },
  // ... more scenarios
]

Each scenario object should include:
- "title": A short, descriptive title (maximum 20 words).
- "description": A concise explanation of the scenario (maximum 50 words).
- "items": A list of 3 to 5 specific steps or events that contribute to the scenario. 
`

    // Get the scenarios using the defined schema
    const scenariosResult = await getStructuredOutput(
      scenariosPrompt,
      ScenarioSchema
    )
    // Ensure scenarios is an array, even if only one scenario is returned
    const scenarios = Array.isArray(scenariosResult)
      ? scenariosResult
      : [scenariosResult]

    // Reset allScenariosData
    allScenariosData = []

    // Process each scenario 🔄
    for (const scenario of scenarios) {
      console.log('Scenario:', scenario)

      // Array to store data for items within the current scenario
      const scenarioItemsData = []

      // Process each item (step) within the scenario 🔍
      for (const item of scenario.items) {
        // Generate ETA for the item ⏱️
        const eta = await generateETA(item)

        // Generate historical analogy for the item 🏛️
        const analogy = await generateAnalogy(item)

        // Stakeholder Analysis 👥
        const stakeholders = await analyzeStakeholders(item)

        // Generate Innovation 💡
        const innovation = await generateInnovation(item)

        // Generate Future Timelines 🔮
        const futureTimelines = await generateFutureTimelines(item)

        console.log('  Item:', item)
        console.log('    ETA:', eta)
        console.log('    Future Timelines:', futureTimelines)
        console.log('    Analogy:', analogy)
        console.log('    Stakeholders:', stakeholders)
        console.log('    Innovation:', innovation)

        // Add the data for the current item to the scenarioItemsData array
        scenarioItemsData.push({
          item,
          eta,
          analogy,
          stakeholders,
          innovation,
          futureTimelines,
        })
      }

      // Add the scenario and its items data to the allScenariosData array
      allScenariosData.push({ scenario, items: scenarioItemsData })
    }

    let finalMarkdownContent = '' // Initialize the final Markdown content

    // Add the main header and selected topic
    finalMarkdownContent += '# Positive Future Scenarios for AI\n\n'
    finalMarkdownContent += `Based on the topic: "${selectedTopic}"\n\n`
    finalMarkdownContent +=
      'TWO distinct scenarios illustrating how AI can transform humanity.\n\n'

    // Process each scenario 🔄
    for (const { scenario, items } of allScenariosData) {
      console.log('Generating Markdown for scenario:', scenario.title) // Log the scenario being processed

      // Generate Markdown for the current scenario
      const scenarioMarkdown = await generateMarkdownForScenario(
        scenario,
        items
      )

      // Append the scenario Markdown to the final Markdown content
      finalMarkdownContent += scenarioMarkdown
    }

    // Save the final Markdown content to a file 💾
    await saveToFile(finalMarkdownContent)
  } catch (error) {
    console.error('Error in main function:', error)
  }
}

// Start the server after the main function completes using an async IIFE
;(async () => {
  try {
    await main() // Wait for the main function to complete
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Error starting the server:', error)
  }
})()
