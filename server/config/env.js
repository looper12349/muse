// config/env.js
require('dotenv').config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-assistant',
  
  // JWT Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  
  // LLM Configuration
  DEFAULT_LLM_PROVIDER: process.env.DEFAULT_LLM_PROVIDER || 'google',
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o',
  
  // Google
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GOOGLE_MODEL: process.env.GOOGLE_MODEL || 'gemini-pro',
  
  // Claude (Anthropic)
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
  
  // Deepseek
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || 'deepseek-coder',
  
  // Feature Flags
  ENABLE_LLM_SWITCHING: process.env.ENABLE_LLM_SWITCHING === 'true',
  ENABLE_MODEL_SELECTION: process.env.ENABLE_MODEL_SELECTION === 'true'
};