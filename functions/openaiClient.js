import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

// Validate API key exists
const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error(
    'API key is required. Please set OPENROUTER_API_KEY or OPENAI_API_KEY in your .env file'
  );
}

// Configure client for OpenRouter or OpenAI
const baseURL = process.env.USE_OPENROUTER === 'true'
  ? 'https://openrouter.ai/api/v1'
  : undefined;

export const openai = new OpenAI({
  apiKey,
  baseURL,
  defaultHeaders: baseURL ? {
    'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:4000',
    'X-Title': process.env.YOUR_SITE_NAME || 'AI Scenarios Generator',
  } : undefined
});
