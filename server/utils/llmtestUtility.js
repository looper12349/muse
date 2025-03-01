// utils/llmTestUtility.js

/**
 * Utility to test LLM provider connections
 */
const { LLM_PROVIDERS } = require('../config/llmConfig');
const { LLMFactory } = require('../services/llmFactory');

/**
 * Test a single LLM provider connection
 * @param {string} providerName - The name of the provider to test
 * @returns {Object} - Results of the test
 */
const testProviderConnection = async (providerName) => {
  if (!LLM_PROVIDERS[providerName]) {
    return {
      provider: providerName,
      success: false,
      message: `Provider "${providerName}" not supported`,
      time: 0
    };
  }

  const testPrompt = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Say hello in one short sentence.' }
  ];

  const startTime = Date.now();
  try {
    // Get the adapter for this provider
    const adapter = LLMFactory.getAdapter(providerName);
    
    // Test the connection
    const response = await adapter.generateResponse(testPrompt);
    const endTime = Date.now();
    
    return {
      provider: providerName,
      providerName: LLM_PROVIDERS[providerName].name,
      model: adapter.model,
      success: true,
      response,
      time: endTime - startTime,
      message: 'Connection successful'
    };
  } catch (error) {
    const endTime = Date.now();
    return {
      provider: providerName,
      providerName: LLM_PROVIDERS[providerName].name,
      success: false,
      error: error.message,
      time: endTime - startTime,
      message: `Connection failed: ${error.message}`
    };
  }
};

/**
 * Test all configured LLM providers
 * @returns {Array} - Results for all providers
 */
const testAllProviders = async () => {
  const results = [];
  
  for (const provider of Object.keys(LLM_PROVIDERS)) {
    const result = await testProviderConnection(provider);
    results.push(result);
  }
  
  return results;
};

module.exports = {
  testProviderConnection,
  testAllProviders
};