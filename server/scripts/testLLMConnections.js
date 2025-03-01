// scripts/testLLMConnections.js
require('dotenv').config();
const { testAllProviders, testProviderConnection } = require('../utils/llmtestUtility');

/**
 * Script to test all LLM provider connections
 */
async function main() {
  console.log('Testing LLM provider connections...\n');
  
  // Check if a specific provider was requested
  const specificProvider = process.argv[2];
  
  if (specificProvider) {
    console.log(`Testing connection to ${specificProvider}...`);
    const result = await testProviderConnection(specificProvider);
    
    if (result.success) {
      console.log(`✅ ${result.providerName} (${result.provider}): Connected successfully`);
      console.log(`   Model: ${result.model}`);
      console.log(`   Response: "${result.response}"`);
      console.log(`   Time: ${result.time}ms`);
    } else {
      console.log(`❌ ${result.providerName || result.provider}: Connection failed`);
      console.log(`   Error: ${result.error || result.message}`);
    }
  } else {
    // Test all providers
    console.log('Testing all configured LLM providers...\n');
    const results = await testAllProviders();
    
    // Display results
    console.log('Connection test results:');
    console.log('======================\n');
    
    let successCount = 0;
    
    for (const result of results) {
      if (result.success) {
        console.log(`✅ ${result.providerName} (${result.provider}): Connected successfully`);
        console.log(`   Model: ${result.model}`);
        console.log(`   Response: "${result.response}"`);
        console.log(`   Time: ${result.time}ms\n`);
        successCount++;
      } else {
        console.log(`❌ ${result.providerName || result.provider}: Connection failed`);
        console.log(`   Error: ${result.error || result.message}\n`);
      }
    }
    
    console.log(`Summary: ${successCount}/${results.length} providers connected successfully.`);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});