// const Thread = require('../models/thread');
// const Message = require('../models/message');
// const Problem = require('../models/');
// const { createThread, getThreadMessages, addMessageAndGetResponse } = require('../services/threadService');
// const asyncHandler = require('../utils/asyncHandler');
// const ApiResponse = require('../utils/apiResponse');

// // @desc    Create a new thread
// // @route   POST /api/threads
// // @access  Private
// exports.createThread = asyncHandler(async (req, res, next) => {
//   const { problemId } = req.body;

//   // Validate problem exists
//   const problem = await Problem.findById(problemId);
//   if (!problem) {
//     return res.status(404).json(new ApiResponse(false, null, 'Problem not found'));
//   }

//   // Create thread
//   const thread = await createThread(req.user.id, problemId);

//   res.status(201).json(new ApiResponse(true, { thread }, 'Thread created successfully'));
// });

// // @desc    Get all threads for current user
// // @route   GET /api/threads
// // @access  Private
// exports.getThreads = asyncHandler(async (req, res, next) => {
//   const threads = await Thread.find({ user: req.user.id })
//     .populate('problem', 'title leetcodeUrl')
//     .sort({ lastMessageAt: -1 });

//   res.status(200).json(new ApiResponse(true, { threads }, 'Threads retrieved successfully'));
// });

// // @desc    Get thread by ID with messages
// // @route   GET /api/threads/:id
// // @access  Private
// exports.getThread = asyncHandler(async (req, res, next) => {
//   const thread = await Thread.findById(req.params.id)
//     .populate('problem');

//   if (!thread) {
//     return res.status(404).json(new ApiResponse(false, null, 'Thread not found'));
//   }

//   // Verify thread belongs to user
//   if (thread.user.toString() !== req.user.id) {
//     return res.status(403).json(new ApiResponse(false, null, 'Not authorized to access this thread'));
//   }

//   // Get messages
//   const messages = await getThreadMessages(req.params.id);

//   res.status(200).json(new ApiResponse(true, { thread, messages }, 'Thread retrieved successfully'));
// });

// // @desc    Send a message and get a response
// // @route   POST /api/threads/:id/messages
// // @access  Private
// exports.sendMessage = asyncHandler(async (req, res, next) => {
//   const { content } = req.body;
//   const threadId = req.params.id;

//   // Validate content
//   if (!content || content.trim() === '') {
//     return res.status(400).json(new ApiResponse(false, null, 'Message content is required'));
//   }

//   // Check if thread exists and belongs to user
//   const thread = await Thread.findById(threadId);
//   if (!thread) {
//     return res.status(404).json(new ApiResponse(false, null, 'Thread not found'));
//   }
  
//   if (thread.user.toString() !== req.user.id) {
//     return res.status(403).json(new ApiResponse(false, null, 'Not authorized to access this thread'));
//   }

//   // Get problem for context
//   const problem = await Problem.findById(thread.problem);

//   // Add message and get response
//   const { userMessage, assistantMessage } = await addMessageAndGetResponse(threadId, content, problem);

//   res.status(201).json(new ApiResponse(true, { 
//     userMessage, 
//     assistantMessage 
//   }, 'Message sent and response received'));
// });



const Thread = require('../models/thread');
const Message = require('../models/message');
const Problem = require('../models/problems');
const { 
  createThread, 
  getThreadMessages, 
  addMessageAndGetResponse,
  deleteThreadAndMessages
} = require('../services/threadService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { LLM_PROVIDERS } = require('../config/llmConfig');

// @desc    Create a new thread
// @route   POST /api/threads
// @access  Private
exports.createThread = asyncHandler(async (req, res, next) => {
  const { problemId, llmProvider } = req.body;

  // Validate problem exists
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json(new ApiResponse(false, null, 'Problem not found'));
  }

  // Validate LLM provider if provided
  if (llmProvider && !Object.keys(LLM_PROVIDERS).includes(llmProvider)) {
    return res.status(400).json(new ApiResponse(false, null, 'Invalid LLM provider'));
  }

  // Create thread
  const thread = await createThread(req.user.id, problemId, llmProvider);

  res.status(201).json(new ApiResponse(true, { thread }, 'Thread created successfully'));
});

// @desc    Get all threads for current user
// @route   GET /api/threads
// @access  Private
exports.getThreads = asyncHandler(async (req, res, next) => {
  const threads = await Thread.find({ user: req.user.id })
    .populate('problem', 'title leetcodeUrl')
    .sort({ lastMessageAt: -1 });

  res.status(200).json(new ApiResponse(true, { threads }, 'Threads retrieved successfully'));
});

// @desc    Get thread by ID with messages
// @route   GET /api/threads/:id
// @access  Private
exports.getThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id)
    .populate('problem');

  if (!thread) {
    return res.status(404).json(new ApiResponse(false, null, 'Thread not found'));
  }

  // Verify thread belongs to user
  if (thread.user.toString() !== req.user.id) {
    return res.status(403).json(new ApiResponse(false, null, 'Not authorized to access this thread'));
  }

  // Get messages
  const messages = await getThreadMessages(req.params.id);

  res.status(200).json(new ApiResponse(true, { 
    thread, 
    messages, 
    availableLlmProviders: Object.keys(LLM_PROVIDERS) 
  }, 'Thread retrieved successfully'));
});

// @desc    Update thread information
// @route   PUT /api/threads/:id
// @access  Private
exports.updateThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);
  
  if (!thread) {
    return res.status(404).json(new ApiResponse(false, null, 'Thread not found'));
  }
  
  // Verify thread belongs to user
  if (thread.user.toString() !== req.user.id) {
    return res.status(403).json(new ApiResponse(false, null, 'Not authorized to update this thread'));
  }
  
  // Update fields
  const { title } = req.body;
  
  if (title) {
    thread.title = title;
  }
  
  await thread.save();
  
  res.status(200).json(new ApiResponse(true, { thread }, 'Thread updated successfully'));
});

// @desc    Delete a thread and all its messages
// @route   DELETE /api/threads/:id
// @access  Private
exports.deleteThread = asyncHandler(async (req, res, next) => {
  const thread = await Thread.findById(req.params.id);
  
  if (!thread) {
    return res.status(404).json(new ApiResponse(false, null, 'Thread not found'));
  }
  
  // Verify thread belongs to user
  if (thread.user.toString() !== req.user.id) {
    return res.status(403).json(new ApiResponse(false, null, 'Not authorized to delete this thread'));
  }
  
  await deleteThreadAndMessages(req.params.id);
  
  res.status(200).json(new ApiResponse(true, null, 'Thread deleted successfully'));
});

// @desc    Update LLM provider for a thread
// @route   PUT /api/threads/:id/llm
// @access  Private
exports.updateLlmProvider = asyncHandler(async (req, res, next) => {
  const { llmProvider } = req.body;
  
  // Validate LLM provider
  if (!llmProvider || !Object.keys(LLM_PROVIDERS).includes(llmProvider)) {
    return res.status(400).json(new ApiResponse(false, null, 'Invalid LLM provider'));
  }
  
  const thread = await Thread.findById(req.params.id);
  
  if (!thread) {
    return res.status(404).json(new ApiResponse(false, null, 'Thread not found'));
  }
  
  // Verify thread belongs to user
  if (thread.user.toString() !== req.user.id) {
    return res.status(403).json(new ApiResponse(false, null, 'Not authorized to update this thread'));
  }
  
  thread.llmProvider = llmProvider;
  await thread.save();
  
  res.status(200).json(new ApiResponse(true, { thread }, 'LLM provider updated successfully'));
});

// @desc    Send a message and get a response
// @route   POST /api/threads/:id/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const threadId = req.params.id;

  // Validate content
  if (!content || content.trim() === '') {
    return res.status(400).json(new ApiResponse(false, null, 'Message content is required'));
  }

  // Check if thread exists and belongs to user
  const thread = await Thread.findById(threadId);
  if (!thread) {
    return res.status(404).json(new ApiResponse(false, null, 'Thread not found'));
  }
  
  if (thread.user.toString() !== req.user.id) {
    return res.status(403).json(new ApiResponse(false, null, 'Not authorized to access this thread'));
  }

  // Get problem for context
  const problem = await Problem.findById(thread.problem);

  // Add message and get response
  const { userMessage, assistantMessage } = await addMessageAndGetResponse(threadId, content, problem, thread.llmProvider);

  res.status(201).json(new ApiResponse(true, { 
    userMessage, 
    assistantMessage,
    currentLlmProvider: thread.llmProvider
  }, 'Message sent and response received'));
});