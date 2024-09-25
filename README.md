# AI Positive Future Scenarios Generator

This project uses the OpenAI API (specifically the gpt-4-mini model) to generate positive and ideal future scenarios where AI is used to benefit humanity. It then analyzes these scenarios, providing estimated timelines (ETAs), historical analogies, stakeholder analyses, innovative ideas, and potential future timelines for each step within the scenarios. The output is presented in an interactive and visually engaging dashboard built with Vue.js and Tailwind CSS.

## Features

- **Scenario Generation:** Generates distinct and detailed positive AI scenarios across various domains (e.g., social impact, environment, healthcare, education).
- **ETA Estimation:** Provides estimated timelines for when each step within a scenario could be realized, considering current technological trends.
- **Future Timelines:** Generates optimistic, pessimistic, and realistic timelines for each step, along with potential wildcard events.
- **Historical Analogy:** Finds a relevant historical analogy for each step, highlighting a similar advancement and its impact, along with lessons learned.
- **Stakeholder Analysis:** Identifies key stakeholders who would be affected by each step and provides a brief description of their role in the scenario.
- **Innovation Generation:** Brainstorms "moonshot" ideas or innovations that could enhance or accelerate each step, pushing the boundaries of what's possible.
- **Interactive Dashboard:** Presents the generated scenarios and analyses in a visually appealing and user-friendly dashboard built with Vue.js and Tailwind CSS.

## How it Works

1. **Scenario Prompting:** The script starts by prompting the gpt-4-mini model to generate positive AI scenarios based on a detailed prompt.
2. **Scenario Processing:** It then iterates through each scenario and its individual steps (items).
3. **AI Agent Workflows:** For each step, it uses the gpt-4-mini model as an AI agent to:
   - Generate an estimated timeline (ETA).
   - Generate optimistic, pessimistic, and realistic future timelines.
   - Find a relevant historical analogy.
   - Identify and analyze key stakeholders.
   - Generate innovative ideas.
4. **Dashboard Rendering:** The Vue.js app fetches the data from the Node.js server and dynamically renders the scenarios and their details in an interactive dashboard.

## Getting Started

1. **Prerequisites:**
   - Node.js and npm installed.
   - An OpenAI API key (set as the `OPENAI_API_KEY` environment variable). You can get an API key from [OpenAI's website](https://platform.openai.com/account/api-keys).
2. **Installation:**
   ```bash
   git clone https://github.com/ryan258/node-oai-structured-output.git
   cd your-repo-name
   npm install
   ```
3. **Configuration:**
   - Create a `.env` file in the project's root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. **Running the Project:**
   ```bash
   node index.js
   ```
   This will start the Node.js server and the Vue.js app.
5. **Accessing the Dashboard:**
   Open your web browser and go to `http://localhost:3003/` (or the port you specified in your `index.js` file).

## Project Structure

- `index.js`: The main Node.js script that handles scenario generation, AI agent workflows, and the Express server.
- `index.html`: The Vue.js app that fetches data from the server and renders the interactive dashboard.
- `logs/`: A directory where the generated Markdown files are saved (optional).

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
