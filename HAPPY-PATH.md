# 🌟 Happy Path Guide

This guide outlines the ideal workflows for using the **AI Positive Future Scenarios Generator**. Follow these steps to ensure a smooth experience.

## 📋 Prerequisites

1.  **Node.js**: Ensure Node.js (v18+) is installed.
2.  **API Key**: You need an API key from [OpenRouter](https://openrouter.ai/) (recommended) or OpenAI.

## 🚀 Quick Start (Interactive Mode)

This is the easiest way to generate scenarios and view them.

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
    ```text
    Generating scenario based on: The Future of Urban Gardening
    ...
    Server listening at http://localhost:4000
    ```

5.  **View the Dashboard**:
    Open your browser to [http://localhost:4000](http://localhost:4000). You will see your generated scenarios beautifully visualized!

---

## 🤖 API Mode (Advanced)

Use this mode if you want to trigger generation programmatically (e.g., from another app or script).

1.  **Ensure Server is Running**:
    ```bash
    npm start
    ```

2.  **Trigger Generation**:
    Send a POST request to `/api/generate`. **Crucial**: You must provide the `x-admin-key` header matching your `.env` file.

    ```bash
    curl -X POST http://localhost:4000/api/generate \
      -H "Content-Type: application/json" \
      -H "x-admin-key: secret123" \
      -d '{"topic": "Education in 2050"}'
    ```

3.  **Check Status**:
    You will receive a JSON response confirming the process started.
    ```json
    {
      "message": "Scenario generation started",
      "status": "processing"
    }
    ```

4.  **View Results**:
    Refresh [http://localhost:4000](http://localhost:4000) to see the new scenarios once generation is complete.

---

## ✅ Verification Checklist

- [ ] **Server Starts**: You see "Server listening at..." in the console.
- [ ] **Dashboard Loads**: The web page loads without errors.
- [ ] **Scenarios Appear**: After generation, cards with titles, ETAs, and timelines are visible.
- [ ] **No Errors**: The console doesn't show "Unauthorized" or "Invalid request".

## 🆘 Troubleshooting

-   **"Unauthorized" Error**: Make sure your `x-admin-key` header matches the `ADMIN_API_KEY` in your `.env` file.
-   **"Topic cannot be empty"**: Ensure you are sending a JSON body with a `topic` field.
-   **Server Address in Use**: If port 4000 is busy, change `PORT` in `.env`.
