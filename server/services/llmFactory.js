// services/llmFactory.js
const { 
    getClientForProvider, 
    getProviderConfig 
  } = require('../config/llmConfig');
  
  // Base LLM Adapter
  class BaseLLMAdapter {
    constructor(provider) {
      this.provider = getProviderConfig(provider);
      this.client = getClientForProvider(provider);
      this.model = this.provider.models.default;
      this.temperature = this.provider.temperature;
      this.maxTokens = this.provider.maxTokens;
    }
  
    async generateResponse(prompt) {
      throw new Error('Method not implemented');
    }
  
    formatPrompt(prompt) {
      return prompt;
    }
  }
  
  // OpenAI Adapter
  class OpenAIAdapter extends BaseLLMAdapter {
    constructor() {
      super('openai');
    }
  
    async generateResponse(prompt) {
      try {
        const completion = await this.client.chat.completions.create({
          model: this.model,
          messages: this.formatPrompt(prompt),
          temperature: this.temperature,
          max_tokens: this.maxTokens,
        });
        
        return completion.choices[0].message.content;
      } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${error.message}`);
      }
    }
  
    formatPrompt(prompt) {
      // OpenAI already uses the standard format
      return prompt;
    }
  }
  
  // Google Gemini Adapter
  class GoogleAdapter extends BaseLLMAdapter {
    constructor() {
      super('google');
    }
  
    async generateResponse(prompt) {
      try {
        const model = this.client.getGenerativeModel({ model: this.model });
        const formattedPrompt = this.formatPrompt(prompt);
        
        const result = await model.generateContent(formattedPrompt);
        return result.response.text();
      } catch (error) {
        console.error('Google API error:', error);
        throw new Error(`Google API error: ${error.message}`);
      }
    }
  
    formatPrompt(prompt) {
      // Convert chat format to string format for Gemini
      return prompt.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
    }
  }
  
  // Claude Adapter
  class ClaudeAdapter extends BaseLLMAdapter {
    constructor() {
      super('claude');
    }
  
    async generateResponse(prompt) {
      try {
        const message = await this.client.messages.create({
          model: this.model,
          messages: this.formatPrompt(prompt),
          max_tokens: this.maxTokens,
          temperature: this.temperature,
        });
        
        return message.content[0].text;
      } catch (error) {
        console.error('Claude API error:', error);
        throw new Error(`Claude API error: ${error.message}`);
      }
    }
  
    formatPrompt(prompt) {
      // Claude can use standard format, but we might need to adjust based on their requirements
      return prompt;
    }
  }
  
  // Deepseek Adapter
  class DeepseekAdapter extends BaseLLMAdapter {
    constructor() {
      super('deepseek');
    }
  
    async generateResponse(prompt) {
      try {
        const response = await this.client.completions.create({
          model: this.model,
          prompt: this.formatPrompt(prompt),
          temperature: this.temperature,
          max_tokens: this.maxTokens
        });
        
        return response.choices[0].text;
      } catch (error) {
        console.error('Deepseek API error:', error);
        throw new Error(`Deepseek API error: ${error.message}`);
      }
    }
  
    formatPrompt(prompt) {
      // Format for Deepseek
      return prompt.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    }
  }
  
  // LLM Factory
  class LLMFactory {
    static getAdapter(provider) {
      switch (provider) {
        case 'openai':
          return new OpenAIAdapter();
        case 'google':
          return new GoogleAdapter();
        case 'claude':
          return new ClaudeAdapter();
        case 'deepseek':
          return new DeepseekAdapter();
        default:
          return new OpenAIAdapter(); // Default to OpenAI
      }
    }
  }
  
  // Shared function to generate response using the factory pattern
  const generateWithFactory = async (problem, messages, providerName) => {
    try {
      const adapter = LLMFactory.getAdapter(providerName);
      const promptBuilder = require('../utils/promptBuilder');
      const prompt = promptBuilder.buildPrompt(problem, messages, providerName);
      return await adapter.generateResponse(prompt);
    } catch (error) {
      console.error(`Error with LLM Factory (${providerName}):`, error);
      throw new Error(`Failed to generate response with ${providerName}: ${error.message}`);
    }
  };
  
  module.exports = {
    LLMFactory,
    generateWithFactory,
    BaseLLMAdapter,
    OpenAIAdapter,
    GoogleAdapter,
    ClaudeAdapter,
    DeepseekAdapter
  };