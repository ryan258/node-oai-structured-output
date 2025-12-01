# AI Positive Future Scenarios Generator

This project uses AI APIs (OpenRouter or OpenAI) to generate positive and ideal future scenarios where AI is used to benefit humanity. It then analyzes these scenarios, providing estimated timelines (ETAs), historical analogies, stakeholder analyses, innovative ideas, and potential future timelines for each step within the scenarios. The output is presented in an interactive and visually engaging dashboard built with Vue.js and Tailwind CSS.

**NEW:** Now supports [OpenRouter](https://openrouter.ai/) for access to multiple AI models (GPT-4, Claude, Llama, and more) with a single API!

> 📖 **See [OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md) for detailed setup instructions, model recommendations, and troubleshooting.**

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
   - An API key from either:
     - [OpenRouter](https://openrouter.ai/keys) (recommended - access to multiple models)
     - [OpenAI](https://platform.openai.com/account/api-keys) (direct access)

2. **Installation:**
   ```bash
   git clone https://github.com/ryan258/node-oai-structured-output.git
   cd node-oai-structured-output
   npm install
   ```

3. **Configuration:**
   Create a `.env` file in the project's root directory:

   **Option A: Using OpenRouter (Recommended)**
   ```bash
   USE_OPENROUTER=true
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   AI_MODEL=openai/gpt-4o-mini
   PORT=4000
   ```

   **Option B: Using OpenAI Directly**
   ```bash
   USE_OPENROUTER=false
   OPENAI_API_KEY=your_openai_api_key_here
   AI_MODEL=gpt-4o-mini
   PORT=4000
   ```

   See `.env.example` for all available configuration options.
4. **Running the Project:**
   ```bash
   node index.js
   ```
   **IMPORTANT:**
   - The script will prompt you: `Enter a scenario prompt (or press Enter for AI-generated topics):`
   - **Type your prompt or just press Enter.**
   - The server will do some work. When you see `Server listening at http://localhost:4000`, **then** you can visit the web dashboard.

5. **Accessing the Dashboard:**
   Open your web browser and go to `http://localhost:4000/` (or the port you specified in your `.env` file).

## Why OpenRouter?

[OpenRouter](https://openrouter.ai/) provides several advantages:

- **Access to Multiple Models:** Use GPT-4, Claude, Llama, Gemini, and more with a single API key
- **Cost Optimization:** Choose the best model for your budget (from free to premium)
- **Reliability:** Automatic fallback if a model is unavailable
- **Transparency:** See exactly what you're paying for each request
- **Rate Limit Management:** Better handling of rate limits across providers

### Available Models via OpenRouter

Popular models you can use (set via `AI_MODEL` in `.env`):

- `openai/gpt-4o-mini` - Fast and affordable (recommended default)
- `openai/gpt-4o` - Most capable GPT-4 model
- `anthropic/claude-3-sonnet` - Anthropic's balanced model
- `anthropic/claude-3-opus` - Most capable Claude model
- `meta-llama/llama-3-70b-instruct` - Open source alternative
- `google/gemini-pro` - Google's AI model

See the full list at [OpenRouter Models](https://openrouter.ai/models).

## How the Server Works

- The web dashboard is **not available** until you see `Server listening at ...` in your terminal.
- If you visit the site before that, you'll get a connection error.
- After the server is listening, you can refresh your browser to see the dashboard.

## Project Structure

- `index.js`: The main Node.js script that handles scenario generation, AI agent workflows, and the Express server.
- `index.html`: The Vue.js app that fetches data from the server and renders the interactive dashboard.
- `functions/`: Modularized logic for scenario generation and AI operations
  - `openaiClient.js`: Configures the AI client (OpenRouter or OpenAI)
  - `getStructuredOutput.js`: Core function for getting structured responses from AI
  - `schemas.js`: Zod schemas for validation
  - Other helper functions for specific AI tasks
- `.env`: Environment variables file. Configure `AI_MODEL`, `PORT`, and API keys here.
- `logs/`: A directory where the generated Markdown files are saved (optional).
- **`zod_kids_example.js`**: A simple Zod lesson for kids. Checks if a pet has a name and age.
- **`zod_kids_openai_example.js`**: Lesson 2 for kids! Asks AI for a fun animal fact and uses Zod to check it.

## Using Zod for Structured Outputs

This project uses [Zod](https://zod.dev/) to define and validate schemas for structured outputs, especially for AI-generated content. Zod ensures that data matches the expected structure and provides clear error messages if validation fails.

### Minimal Example

You can try this standalone script to see Zod in action:

```js
// zod_example.js
import { z } from 'zod';

// Define a schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  isActive: z.boolean().default(true),
});

// Example data
const exampleData = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
};

const invalidData = {
  id: 'not-a-number',
  name: 'Bob',
  email: 'not-an-email',
};

// Validate data
try {
  const user = UserSchema.parse(exampleData);
  console.log('Valid user:', user);
} catch (e) {
  console.error('Validation failed for exampleData:', e.errors);
}

try {
  const user = UserSchema.parse(invalidData);
  console.log('Valid user:', user);
} catch (e) {
  console.error('Validation failed for invalidData:', e.errors);
}

// Safe parsing (does not throw)
const result = UserSchema.safeParse(exampleData);
if (result.success) {
  console.log('Safe parse succeeded:', result.data);
} else {
  console.error('Safe parse failed:', result.error.errors);
}
```

To run this example:

```bash
node zod_example.js
```

### Project Usage

In this project, Zod schemas are used to validate:
- AI scenario outputs
- Timelines, analogies, stakeholder analyses, and more

See `index.js` for advanced usage, including parsing OpenAI API responses with Zod schemas.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
