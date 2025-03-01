// routes/llmRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { LLM_PROVIDERS, DEFAULT_LLM_PROVIDER } = require('../config/llmConfig');
const { generateResponse, getAvailableModels, setModelForProvider } = require('../services/llmService');
const { testProviderConnection, testAllProviders } = require('../utils/llmtestUtility');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/user');

const router = express.Router();

// @desc    Get all available LLM providers
// @route   GET /api/llm/providers
// @access  Private
router.get('/providers', protect, asyncHandler(async (req, res) => {
  // Format providers for frontend
  const providers = Object.entries(LLM_PROVIDERS).map(([id, config]) => ({
    id,
    name: config.name,
    defaultModel: config.models.default,
    isDefault: id === DEFAULT_LLM_PROVIDER
  }));

  res.status(200).json(new ApiResponse(true, { 
    providers,
    defaultProvider: DEFAULT_LLM_PROVIDER
  }, 'Providers retrieved successfully'));
}));

// @desc    Get available models for a provider
// @route   GET /api/llm/providers/:provider/models
// @access  Private
router.get('/providers/:provider/models', protect, asyncHandler(async (req, res) => {
  const { provider } = req.params;
  
  // Check if provider exists
  if (!LLM_PROVIDERS[provider]) {
    return res.status(404).json(new ApiResponse(false, null, 'Provider not found'));
  }
  
  // Get models for the provider
  const models = getAvailableModels(provider);
  
  res.status(200).json(new ApiResponse(true, { 
    provider,
    models,
    defaultModel: LLM_PROVIDERS[provider].models.default
  }, 'Models retrieved successfully'));
}));

// @desc    Test an LLM provider connection
// @route   POST /api/llm/test
// @access  Private
router.post('/test', protect, asyncHandler(async (req, res) => {
  const { provider } = req.body;
  
  // Validate provider
  if (!provider || !LLM_PROVIDERS[provider]) {
    return res.status(400).json(new ApiResponse(false, null, 'Invalid provider'));
  }
  
  try {
    // Test the provider connection
    const result = await testProviderConnection(provider);
    
    if (result.success) {
      res.status(200).json(new ApiResponse(true, {
        provider: result.provider,
        connected: true,
        model: result.model,
        response: result.response,
        responseTime: result.time
      }, 'Provider connection successful'));
    } else {
      res.status(200).json(new ApiResponse(false, {
        provider: result.provider,
        connected: false,
        error: result.error || result.message
      }, 'Provider connection failed'));
    }
  } catch (error) {
    console.error(`Provider test failed:`, error);
    
    res.status(200).json(new ApiResponse(false, { 
      provider,
      connected: false,
      error: error.message
    }, 'Provider connection test failed'));
  }
}));

// @desc    Test all LLM provider connections
// @route   GET /api/llm/test-all
// @access  Private
router.get('/test-all', protect, asyncHandler(async (req, res) => {
  try {
    // Test all provider connections
    const results = await testAllProviders();
    
    // Format results for response
    const formattedResults = results.map(result => ({
      provider: result.provider,
      name: result.providerName,
      connected: result.success,
      model: result.model,
      response: result.response,
      responseTime: result.time,
      error: result.error
    }));
    
    // Count successful connections
    const successCount = formattedResults.filter(r => r.connected).length;
    
    res.status(200).json(new ApiResponse(true, { 
      results: formattedResults,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount
      }
    }, 'Provider connection tests completed'));
  } catch (error) {
    console.error(`All providers test failed:`, error);
    
    res.status(500).json(new ApiResponse(false, null, 
      'Failed to test provider connections: ' + error.message));
  }
}));

// @desc    Set user preferred LLM provider
// @route   POST /api/llm/preference
// @access  Private
router.post('/preference', protect, asyncHandler(async (req, res) => {
  const { provider, model } = req.body;
  
  // Validate provider
  if (!provider || !LLM_PROVIDERS[provider]) {
    return res.status(400).json(new ApiResponse(false, null, 'Invalid provider'));
  }
  
  // Update with a specific model if provided
  if (model) {
    const modelSet = setModelForProvider(provider, model);
    if (!modelSet) {
      return res.status(400).json(new ApiResponse(false, null, 'Invalid model for this provider'));
    }
  }
  
  // Save user preference
  await User.findByIdAndUpdate(req.user.id, { 
    preferredLlmProvider: provider,
    preferredLlmModel: model || LLM_PROVIDERS[provider].models.default
  });
  
  res.status(200).json(new ApiResponse(true, { 
    provider,
    model: model || LLM_PROVIDERS[provider].models.default
  }, 'Preference updated successfully'));
}));

module.exports = router;