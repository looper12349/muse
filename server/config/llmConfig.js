// config/llmConfig.js
require('dotenv').config();
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Anthropic } = require('@anthropic-ai/sdk');
// Note: Deepseek library might need to be installed
// This is a placeholder implementation
const DeepseekAI = class DeepseekClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.completions = {
      create: async ({ model, prompt, temperature, max_tokens }) => {
        console.log(`DeepseekAI request with model ${model}`);
        // Implementation would depend on the actual Deepseek API
        return {
          choices: [{ text: "This is a placeholder for Deepseek's response" }]
        };
      }
    };
  }
};

// Define available LLM providers with their configurations
const LLM_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: {
      default: process.env.OPENAI_MODEL || 'gpt-4o',
      options: [
        'gpt-4o',
        'gpt-4-turbo',
        'gpt-3.5-turbo'
      ]
    },
    temperature: 0.7,
    maxTokens: 1000,
    client: null,
    initClient: () => {
      return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  },
  
  google: {
    name: 'Google',
    models: {
      default: process.env.GOOGLE_MODEL || 'gemini-pro',
      options: [
        'gemini-pro',
        'gemini-ultra'
      ]
    },
    temperature: 0.7,
    maxTokens: 1000,
    client: null,
    initClient: () => {
      return new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }
  },
  
  claude: {
    name: 'Claude',
    models: {
      default: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
      options: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
      ]
    },
    temperature: 0.7,
    maxTokens: 1000,
    client: null,
    initClient: () => {
      return new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  },
  
  deepseek: {
    name: 'Deepseek',
    models: {
      default: process.env.DEEPSEEK_MODEL || 'deepseek-coder',
      options: [
        'deepseek-coder',
        'deepseek-chat'
      ]
    },
    temperature: 0.7,
    maxTokens: 1000,
    client: null,
    initClient: () => {
      return new DeepseekAI(process.env.DEEPSEEK_API_KEY);
    }
  }
};

// Default LLM provider (can be configured via env)
const DEFAULT_LLM_PROVIDER = process.env.DEFAULT_LLM_PROVIDER || 'openai';

// Initialize clients on-demand
const getClientForProvider = (providerName) => {
  // Default to openai if provider not found
  const providerKey = LLM_PROVIDERS[providerName] ? providerName : DEFAULT_LLM_PROVIDER;
  const provider = LLM_PROVIDERS[providerKey];
  
  // Initialize client if not already initialized
  if (!provider.client) {
    try {
      provider.client = provider.initClient();
    } catch (error) {
      console.error(`Failed to initialize ${provider.name} client:`, error);
      throw new Error(`Failed to initialize ${provider.name} client. Please check your API key.`);
    }
  }
  
  return provider.client;
};

// Get provider config
const getProviderConfig = (providerName) => {
  return LLM_PROVIDERS[providerName] || LLM_PROVIDERS[DEFAULT_LLM_PROVIDER];
};

module.exports = {
  LLM_PROVIDERS,
  DEFAULT_LLM_PROVIDER,
  getClientForProvider,
  getProviderConfig
};