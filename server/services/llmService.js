// services/llmService.js
const { DEFAULT_LLM_PROVIDER } = require('../config/llmConfig');
const { LLMFactory, generateWithFactory } = require('./llmFactory');

/**
 * Generate a response from the selected LLM based on the problem and conversation context
 * Uses the Factory pattern for cleaner implementation
 */
const generateResponse = async (problem, messages, providerName = DEFAULT_LLM_PROVIDER) => {
  try {
    // Use the factory pattern to handle the request
    return await generateWithFactory(problem, messages, providerName);
  } catch (error) {
    console.error(`Error generating LLM response with ${providerName}:`, error);
    
    // If there's an error with the requested provider, try falling back to the default
    if (providerName !== DEFAULT_LLM_PROVIDER) {
      console.log(`Falling back to ${DEFAULT_LLM_PROVIDER}`);
      try {
        return await generateWithFactory(problem, messages, DEFAULT_LLM_PROVIDER);
      } catch (fallbackError) {
        console.error(`Error with fallback provider:`, fallbackError);
        throw new Error(`Failed to generate a response. Please try again later.`);
      }
    }
    
    throw new Error(`Failed to generate a response with ${providerName}. Please try again or select a different provider.`);
  }
};

/**
 * Get available models for a specific provider
 */
const getAvailableModels = (providerName) => {
  try {
    const adapter = LLMFactory.getAdapter(providerName);
    return adapter.provider.models.options;
  } catch (error) {
    console.error(`Error getting models for ${providerName}:`, error);
    return [];
  }
};

/**
 * Set a different model for a specific provider
 */
const setModelForProvider = (providerName, modelName) => {
  try {
    const adapter = LLMFactory.getAdapter(providerName);
    
    // Check if the model is valid for this provider
    if (adapter.provider.models.options.includes(modelName)) {
      adapter.model = modelName;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error setting model for ${providerName}:`, error);
    return false;
  }
};

module.exports = {
  generateResponse,
  getAvailableModels,
  setModelForProvider
};