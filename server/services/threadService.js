// services/threadService.js
const Thread = require('../models/thread');
const Message = require('../models/message');
const { generateResponse } = require('./llmService');
const { DEFAULT_LLM_PROVIDER } = require('../config/llmConfig');

/**
 * Create a new thread for a user and problem
 */
const createThread = async (userId, problemId, llmProvider = DEFAULT_LLM_PROVIDER) => {
  const thread = await Thread.create({
    user: userId,
    problem: problemId,
    llmProvider
  });
  
  return thread;
};

/**
 * Get all messages for a thread
 */
const getThreadMessages = async (threadId) => {
  const messages = await Message.find({ thread: threadId })
    .sort({ createdAt: 1 });
    
  return messages;
};

/**
 * Add a user message to a thread and generate an assistant response
 */
const addMessageAndGetResponse = async (threadId, content, problem, llmProvider) => {
  // Add the user message
  const userMessage = await Message.create({
    thread: threadId,
    sender: 'user',
    content
  });
  
  // Get all messages in the thread for context
  const messages = await getThreadMessages(threadId);
  
  // Generate a response using the specified LLM
  const responseContent = await generateResponse(problem, messages, llmProvider);
  
  // Add the assistant's response
  const assistantMessage = await Message.create({
    thread: threadId,
    sender: 'assistant',
    content: responseContent
  });
  
  // Update the thread's lastMessageAt
  await Thread.findByIdAndUpdate(threadId, {
    lastMessageAt: new Date()
  });
  
  return {
    userMessage,
    assistantMessage
  };
};

/**
 * Change LLM provider for a thread
 */
const updateThreadProvider = async (threadId, newProvider) => {
  const thread = await Thread.findByIdAndUpdate(threadId, {
    llmProvider: newProvider
  }, { new: true });
  
  return thread;
};

/**
 * Delete a thread and all associated messages
 */
const deleteThreadAndMessages = async (threadId) => {
  // Delete all messages for this thread
  await Message.deleteMany({ thread: threadId });
  
  // Delete the thread itself
  await Thread.findByIdAndDelete(threadId);
  
  return true;
};

module.exports = {
  createThread,
  getThreadMessages,
  addMessageAndGetResponse,
  updateThreadProvider,
  deleteThreadAndMessages
};