# AI Positive Future Scenarios Generator

A personal project that uses AI APIs (OpenRouter or OpenAI) to generate optimistic future scenarios exploring how AI could benefit humanity. The system analyzes each scenario with estimated timelines, historical analogies, stakeholder analysis, and innovation opportunities, all presented in an interactive Vue.js dashboard.

**Note:** This is a personal project designed to run locally. It's been a great learning experience for structured AI outputs, async patterns, security best practices, and testing ESM modules.

**Features OpenRouter integration** for access to 100+ AI models (GPT-4, Claude, Llama, Gemini, and more) with a single API!

> 📖 See [OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md) for setup instructions and model recommendations.

## Features

- **Scenario Generation:** Generates distinct and detailed positive AI scenarios across various domains (e.g., social impact, environment, healthcare, education).
- **ETA Estimation:** Provides estimated timelines for when each step within a scenario could be realized, considering current technological trends.
- **Future Timelines:** Generates optimistic, pessimistic, and realistic timelines for each step, along with potential wildcard events.
- **Historical Analogy:** Finds a relevant historical analogy for each step, highlighting a similar advancement and its impact, along with lessons learned.
- **Stakeholder Analysis:** Identifies key stakeholders who would be affected by each step and provides a brief description of their role in the scenario.
- **Innovation Generation:** Brainstorms "moonshot" ideas or innovations that could enhance or accelerate each step, pushing the boundaries of what's possible.
- **Interactive Dashboard:** Presents the generated scenarios and analyses in a visually appealing and user-friendly dashboard built with Vue.js and Tailwind CSS.

## How it Works

1. **Scenario Prompting:** The script prompts an AI model (configurable via `.env`) to generate positive AI scenarios based on your topic.
2. **Scenario Processing:** It then iterates through each scenario and its individual steps (items).
3. **AI Agent Workflows:** For each step, it uses AI to:
   - Generate an estimated timeline (ETA).
   - Generate optimistic, pessimistic, and realistic future timelines.
   - Find a relevant historical analogy.
   - Identify and analyze key stakeholders.
   - Generate innovative ideas.
4. **Parallel Processing:** All AI calls for each item are parallelized using `Promise.all()` for 5x performance boost.
5. **Dashboard Rendering:** The Vue.js app fetches the data from the Node.js server and dynamically renders the scenarios and their details in an interactive dashboard.

## Setup

### Prerequisites
- Node.js and npm
- API key from:
  - [OpenRouter](https://openrouter.ai/keys) (recommended - 100+ models)
  - [OpenAI](https://platform.openai.com/account/api-keys) (direct)

### Installation

```bash
npm install
```

### Quick Start (Interactive Mode)

1.  **Setup Configuration**:
    Copy the example environment file and add your API key.
    ```bash
    cp .env.example .env
    # Edit .env and set OPENROUTER_API_KEY or OPENAI_API_KEY
    # Set ADMIN_API_KEY to a secure value (e.g., "secret123")
    ```

2.  **Start the Server**:
    Run the application in your terminal.
    ```bash
    npm start
    ```

3.  **Follow the Prompts**:
    The CLI will ask for a topic.
    ```text
    Enter a scenario prompt (or press Enter for AI-generated topics):
    > The Future of Urban Gardening
    ```

4.  **Wait for Generation**:
    The AI will generate scenarios, timelines, and analysis. This takes about 15-20 seconds.

5.  **View the Dashboard**:
    Open your browser to [http://localhost:4000](http://localhost:4000).

### Demo Mode (Curated Topics)

Want to see what the AI can really do? Try the curated demo mode with 20 exceptional topics.

1.  **Run Demo Mode**:
    ```bash
    npm run demo
    ```

2.  **Select a Category**:
    Choose from themes like "Hidden Markets", "Societal Effects", or "Weird Science".

3.  **Select a Topic**:
    Pick a specific scenario to generate.

### Configuration

Create a `.env` file in the root:

   **Option A: Using OpenRouter (Recommended)**
   ```bash
   USE_OPENROUTER=true
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ADMIN_API_KEY=your_secure_admin_key
   AI_MODEL=openai/gpt-4o-mini
   PORT=4000
   ```

   **Option B: Using OpenAI Directly**
   ```bash
   USE_OPENROUTER=false
   OPENAI_API_KEY=your_openai_api_key_here
   ADMIN_API_KEY=your_secure_admin_key
   AI_MODEL=gpt-4o-mini
   PORT=4000
   ```

See `.env.example` for all options.

### Running

```bash
npm start
```

The server starts at `http://localhost:4000` (or your configured PORT). In interactive mode (terminal), you'll be prompted for a scenario topic. Otherwise, use the API endpoint to trigger generation.

### Troubleshooting

-   **"Unauthorized" Error**: Make sure your `x-admin-key` header matches the `ADMIN_API_KEY` in your `.env` file.
-   **"Topic cannot be empty"**: Ensure you are sending a JSON body with a `topic` field.
-   **Server Address in Use**: If port 4000 is busy, change `PORT` in `.env`.

### Testing

```bash
npm test
```

## API Endpoints

### GET `/`
Serves the interactive dashboard

### GET `/api/scenarios`
Returns generated scenarios (JSON)

### POST `/api/generate`
Triggers new scenario generation
- **Auth:** Requires `x-admin-key` header (set via `ADMIN_API_KEY` in `.env`)
- **Body:** `{ "topic": "your topic here" }`
- **Response:** `{ "message": "Scenario generation started", "status": "processing" }`

## Project Structure

```
.
├── index.js              # Main server & orchestration
├── index.html            # Vue.js dashboard
├── functions/            # Modular AI operations
│   ├── openaiClient.js   # API client config
│   ├── getStructuredOutput.js
│   ├── schemas.js        # Zod validation
│   └── ...               # Specific generators
├── tests/                # Jest tests
├── logs/                 # Generated markdown output
└── .env                  # Configuration
```

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

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** Vue.js 3, Tailwind CSS
- **AI:** OpenAI SDK (supports OpenRouter)
- **Validation:** Zod
- **Security:** Helmet, CORS, express-rate-limit
- **Testing:** Jest, Supertest

## Notes

This is a personal project exploring AI-generated future scenarios. It's been a great learning experience for:
- Structured AI outputs with Zod
- Async patterns and performance optimization (5x speedup via parallelization)
- Security best practices (Helmet, CORS, rate limiting, authentication)
- Testing ESM modules with Jest

**Current Status:**
- ✅ Core generation pipeline working
- ✅ Security middleware implemented
- ✅ API endpoints with authentication
- ✅ Parallel processing for performance
- ✅ Basic test coverage (~30%)
- 🔄 See [roadmap.md](./roadmap.md) for planned improvements

## License

MIT
