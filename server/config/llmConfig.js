const { LLM_API_KEY, LLM_MODEL, LLM_PROVIDER } = require('./env');
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

let llmClient;

// Initialize the appropriate LLM client based on the provider
if (LLM_PROVIDER === 'openai') {
  llmClient = new OpenAI({
    apiKey: LLM_API_KEY
  });
} else if (LLM_PROVIDER === 'google') {
  llmClient = new GoogleGenerativeAI(LLM_API_KEY);
} else {
  throw new Error(`Unsupported LLM provider: ${LLM_PROVIDER}`);
}

module.exports = {
  llmClient,
  LLM_MODEL,
  LLM_PROVIDER
};