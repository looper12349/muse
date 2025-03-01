// utils/promptBuilder.js

/**
 * Build a prompt for the LLM based on the problem and conversation context
 * Adapts the format based on the provider
 */
const buildPrompt = (problem, messages, provider = 'openai') => {
  // Base system message that provides context about the problem
  let systemMessage = {
    role: 'system',
    content: `You are an AI coding assistant helping a user with a programming problem. 
    
The problem they are working on is: ${problem.title || 'Unknown Problem'}
${problem.description || ''}
${problem.leetcodeUrl ? `LeetCode URL: ${problem.leetcodeUrl}` : ''}
${problem.difficulty ? `Difficulty: ${problem.difficulty}` : ''}
${problem.tags && problem.tags.length > 0 ? `Tags: ${problem.tags.join(', ')}` : ''}

When helping users, follow these principles:
1. Ask clarifying questions if the user's doubt is vague.
2. Break down complex problems into smaller, manageable steps.
3. Suggest alternative approaches if the user is stuck.
4. Explain relevant data structures and algorithms with simple examples.
5. Help identify edge cases and common pitfalls.
6. Encourage good coding practices and optimization considerations.
7. Use the Socratic method - guide through questions rather than direct answers.
8. Note in any condition do not provide the code to them.

Remember, your goal is to help the user learn and understand the problem-solving process, not to solve it for them.`
  };

  // Format conversation history
  const formattedMessages = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));

  // Adapt the prompt structure based on the provider
  switch (provider) {
    case 'openai':
      return [systemMessage, ...formattedMessages];

    case 'google':
      // For Google Gemini, we may need different formatting
      // For now, keep it similar to OpenAI
      return [systemMessage, ...formattedMessages];

    case 'claude':
      // Claude specific format
      // Claude may require specific formatting with system messages
      return [systemMessage, ...formattedMessages];

    case 'deepseek':
      // Deepseek specific format
      return [systemMessage, ...formattedMessages];

    default:
      // Default to OpenAI format
      return [systemMessage, ...formattedMessages];
  }
};

/**
 * Format the final message for specific LLM providers that need special handling
 * This is an alternative approach that can be used if direct message array doesn't work for some providers
 */
const formatFinalPrompt = (prompt, provider) => {
  switch (provider) {
    case 'google':
      // Google may need stringified prompts
      return prompt.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
      
    case 'deepseek':
      // Deepseek may need a different format
      return prompt.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      
    default:
      // Default is to return the original prompt
      return prompt;
  }
};

module.exports = {
  buildPrompt,
  formatFinalPrompt
};