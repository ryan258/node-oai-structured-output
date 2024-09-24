# AI Positive Future Scenarios Generator

This project uses the OpenAI API (specifically the gpt-4-mini model) to generate positive and ideal future scenarios where AI is used to benefit humanity. It then analyzes these scenarios, providing estimated timelines (ETAs), historical analogies, and stakeholder analyses for each step within the scenarios. The output is formatted as a Markdown document for easy readability and sharing.

## Features

* **Scenario Generation:** Generates 5 distinct and detailed positive AI scenarios across various domains (e.g., social impact, environment, healthcare, education).
* **ETA Estimation:** Provides estimated timelines for when each step within a scenario could be realized, considering current technological trends.
* **Historical Analogy:**  Finds a relevant historical analogy for each step, highlighting a similar advancement and its impact, along with lessons learned.
* **Stakeholder Analysis:** Identifies up to 5 key stakeholders who would be affected by each step and provides a brief description of their role in the scenario.
* **Markdown Output:** Formats the generated scenarios, ETAs, analogies, and stakeholder analyses into a well-structured Markdown document.

## How it Works

1. **Scenario Prompting:** The script starts by prompting the gpt-4-mini model to generate 5 positive AI scenarios based on a detailed prompt.
2. **Scenario Processing:** It then iterates through each scenario and its individual steps (items).
3. **AI Agent Workflows:** For each step, it uses the gpt-4-mini model as an AI agent to:
    * Generate an estimated timeline (ETA).
    * Find a relevant historical analogy.
    * Identify and analyze key stakeholders.
4. **Markdown Generation:** Finally, it compiles all the generated information (scenarios, ETAs, analogies, stakeholder analyses) into a Markdown document using the gpt-4-mini model for formatting.
5. **Output:** The Markdown document is saved to a file in the `logs` directory with a timestamp in the filename.

## Getting Started

1. **Prerequisites:**
   * Node.js and npm installed.
   * An OpenAI API key (set as the `OPENAI_API_KEY` environment variable). You can get an API key from [OpenAI's website](https://platform.openai.com/account/api-keys).
2. **Installation:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git 
   cd your-repo-name
   npm install
   ```
3. **Configuration:**
   * Create a `.env` file in the project's root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. **Running the Script:**
   ```bash
   node index.js
   ```
5. **Output:** The generated Markdown file will be saved in the `logs` directory.

## Example Output

The generated Markdown file will contain a structured report like this:

```markdown
# Positive Future Scenarios for AI

Five distinct scenarios illustrating how AI can transform humanity.

## Scenario 1: AI-Powered Personalized Education

AI tailors educational experiences to individual student needs, fostering deeper learning and skill development.

### Item 1: AI-driven learning platforms assess student strengths and weaknesses.

**ETA:** Within the next 5 years.

**Historical Analogy:**

* **Event:** The invention of the printing press.
* **Similarity:** The printing press made knowledge more accessible, similar to how AI can personalize education.
* **Lesson:** Widespread adoption requires addressing accessibility and ensuring equitable distribution of resources.

**Stakeholders:**

* **Students:** Beneficiaries - They receive personalized learning experiences tailored to their needs.
* **Teachers:** Facilitators - They use AI tools to understand student needs and provide targeted support.
* **Educational Institutions:** Implementers - They adopt and integrate AI-powered learning platforms. 

## Scenario 2: ... 
// ... (More scenarios and items with ETAs, analogies, and stakeholder analyses) ...
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. 
