
const express = require('express');
const {
  createThread,
  getThreads,
  getThread,
  sendMessage,
  updateThread,
  deleteThread,
  updateLlmProvider
} = require('../controllers/threadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createThread)
  .get(protect, getThreads);

router.route('/:id')
  .get(protect, getThread)
  .put(protect, updateThread)
  .delete(protect, deleteThread);

router.route('/:id/messages')
  .post(protect, sendMessage);

router.route('/:id/llm')
  .put(protect, updateLlmProvider);

module.exports = router;