# OpenRouter Setup Guide

This guide will help you set up OpenRouter to use multiple AI models with a single API key.

## What is OpenRouter?

[OpenRouter](https://openrouter.ai/) is a unified API gateway that provides access to multiple AI models from different providers (OpenAI, Anthropic, Meta, Google, etc.) through a single, consistent API interface.

### Benefits

- **Multiple Models:** Access GPT-4, Claude, Llama, Gemini, and more with one API key
- **Cost Flexibility:** Choose models based on your budget (from free to premium)
- **Automatic Fallbacks:** If one model is unavailable, automatically use another
- **Transparent Pricing:** See exactly what each request costs
- **Better Rate Limits:** Improved handling across multiple providers

## Getting Started

### Step 1: Create an OpenRouter Account

1. Go to [OpenRouter](https://openrouter.ai/)
2. Click "Sign In" or "Sign Up"
3. Create an account (supports GitHub OAuth for easy signup)

### Step 2: Get Your API Key

1. After logging in, go to [Keys](https://openrouter.ai/keys)
2. Click "Create Key"
3. Give your key a name (e.g., "AI Scenarios Generator")
4. Set a credit limit (optional but recommended)
5. Copy your API key (starts with `sk-or-...`)

### Step 3: Add Credits (If Needed)

Some models are free, but premium models require credits:

1. Go to [Credits](https://openrouter.ai/credits)
2. Add credits via credit card or crypto
3. Start with $5-10 for testing

### Step 4: Configure Your Project

Create or update your `.env` file:

```bash
# Copy from .env.example
cp .env.example .env

# Edit .env with your favorite editor
nano .env
```

Add your configuration:

```bash
# Enable OpenRouter
USE_OPENROUTER=true

# Your OpenRouter API key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Choose your model (see options below)
AI_MODEL=openai/gpt-4o-mini

# Server port
PORT=4000

# Optional: for OpenRouter rankings
YOUR_SITE_URL=http://localhost:4000
YOUR_SITE_NAME=AI Scenarios Generator
```

## Choosing a Model

OpenRouter supports hundreds of models. Here are popular choices:

### Budget-Friendly Options

| Model | Provider | Cost | Best For |
|-------|----------|------|----------|
| `openai/gpt-4o-mini` | OpenAI | $0.15/1M tokens | Fast, affordable, good quality |
| `meta-llama/llama-3-8b-instruct` | Meta | Free | Testing, development |
| `google/gemini-flash-1.5` | Google | $0.075/1M tokens | Very fast responses |

### Balanced Options

| Model | Provider | Cost | Best For |
|-------|----------|------|----------|
| `openai/gpt-4o` | OpenAI | $2.50/1M tokens | High quality, reliable |
| `anthropic/claude-3-sonnet` | Anthropic | $3/1M tokens | Reasoning, long context |
| `google/gemini-pro-1.5` | Google | $1.25/1M tokens | Good balance |

### Premium Options

| Model | Provider | Cost | Best For |
|-------|----------|------|----------|
| `anthropic/claude-3-opus` | Anthropic | $15/1M tokens | Best reasoning, complex tasks |
| `openai/gpt-4-turbo` | OpenAI | $10/1M tokens | Advanced capabilities |

### Free Models (Great for Testing)

- `meta-llama/llama-3-8b-instruct:free`
- `mistralai/mistral-7b-instruct:free`
- `google/gemma-7b-it:free`

**Note:** Free models may have rate limits and lower availability.

## Model Format

Always use the format: `provider/model-name`

Examples:
- ✅ `openai/gpt-4o-mini`
- ✅ `anthropic/claude-3-sonnet`
- ❌ `gpt-4o-mini` (missing provider prefix)

## Testing Your Setup

### Quick Test with Zod Kids Example

```bash
node zod_kids_openai_example.js
```

This will make a simple API call and show you if everything is configured correctly.

### Full Application Test

```bash
node index.js
```

When prompted:
1. Press Enter to let AI generate topics
2. Select a topic from the list
3. Wait for scenarios to generate
4. Open `http://localhost:4000` in your browser

## Monitoring Usage

### Check Your Spending

1. Go to [Activity](https://openrouter.ai/activity)
2. View detailed request logs
3. See cost breakdown by model

### Set Spending Limits

1. Go to [Keys](https://openrouter.ai/keys)
2. Edit your key
3. Set monthly or total limits

## Troubleshooting

### "API key is required" Error

**Problem:** Missing or invalid API key

**Solution:**
```bash
# Check your .env file exists
ls -la .env

# Verify it contains your key
cat .env | grep OPENROUTER_API_KEY

# Make sure there are no quotes around the key
# ✅ OPENROUTER_API_KEY=sk-or-v1-abc123...
# ❌ OPENROUTER_API_KEY="sk-or-v1-abc123..."
```

### "Model not found" Error

**Problem:** Invalid model name or format

**Solution:**
- Use provider prefix: `openai/gpt-4o-mini` not `gpt-4o-mini`
- Check available models at [OpenRouter Models](https://openrouter.ai/models)
- Verify model name spelling

### "Insufficient credits" Error

**Problem:** Not enough credits for paid models

**Solutions:**
1. Add credits at [Credits](https://openrouter.ai/credits)
2. Switch to a free model temporarily
3. Use a cheaper model

### Rate Limit Errors

**Problem:** Too many requests

**Solutions:**
1. Wait a few minutes and try again
2. Upgrade to a paid model (higher limits)
3. Add delays between requests in code

### 401 Unauthorized Error

**Problem:** Invalid API key

**Solutions:**
1. Verify your API key is correct
2. Check if key has expired or been revoked
3. Create a new key at [Keys](https://openrouter.ai/keys)

## Switching Back to OpenAI

If you want to use OpenAI directly instead:

```bash
# In your .env file
USE_OPENROUTER=false
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

## Advanced Configuration

### Using Different Models for Different Tasks

You can modify `functions/getStructuredOutput.js` to use different models for different prompts:

```javascript
export async function getStructuredOutput(prompt, schema = null, modelOverride = null) {
  const defaultModel = process.env.USE_OPENROUTER === 'true'
    ? 'openai/gpt-4o-mini'
    : 'gpt-4o-mini';

  // Use override, environment variable, or default
  const model = modelOverride || process.env.AI_MODEL || defaultModel;

  // ... rest of code
}
```

Then call with different models:

```javascript
// Use fast model for simple tasks
const topics = await getStructuredOutput(prompt, schema, 'openai/gpt-4o-mini');

// Use powerful model for complex analysis
const analysis = await getStructuredOutput(prompt, schema, 'anthropic/claude-3-opus');
```

### Setting Up Fallback Models

OpenRouter automatically falls back to similar models if your primary choice is unavailable. You can see this in your activity logs.

### Custom Headers

The project automatically sets recommended headers:

```javascript
'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:3000',
'X-Title': process.env.YOUR_SITE_NAME || 'AI Scenarios Generator'
```

These help OpenRouter:
- Show your app in their rankings
- Provide better support
- Track usage patterns

## Cost Optimization Tips

1. **Start with mini models:** `openai/gpt-4o-mini` is 10x cheaper than `gpt-4o`
2. **Use free models for development:** Test with free models before using paid ones
3. **Set spending limits:** Prevent unexpected bills
4. **Monitor your usage:** Check activity regularly
5. **Cache responses:** Reuse AI responses when possible (see roadmap.md #16)

## Getting Help

- **OpenRouter Discord:** [Join here](https://discord.gg/openrouter)
- **Documentation:** [OpenRouter Docs](https://openrouter.ai/docs)
- **Model Comparison:** [OpenRouter Models](https://openrouter.ai/models)
- **Status Page:** [status.openrouter.ai](https://status.openrouter.ai/)

## Next Steps

1. ✅ Set up your `.env` file
2. ✅ Choose a model
3. ✅ Test with `node zod_kids_openai_example.js`
4. ✅ Run the full app with `node index.js`
5. 🚀 Experiment with different models to find your favorite!

## Comparison: OpenRouter vs Direct OpenAI

| Feature | OpenRouter | Direct OpenAI |
|---------|------------|---------------|
| **Setup** | One key, many models | One key, OpenAI only |
| **Cost** | Transparent per-request | Monthly billing |
| **Models** | 100+ models | OpenAI models only |
| **Reliability** | Automatic fallbacks | Single provider |
| **Rate Limits** | Better management | Standard limits |
| **Best For** | Flexibility, cost optimization | Simplicity, OpenAI-only |

Both options work great! Choose based on your needs:
- **Use OpenRouter** if you want flexibility and cost optimization
- **Use OpenAI directly** if you only need OpenAI models and prefer simplicity
