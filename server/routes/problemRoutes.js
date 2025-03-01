/**
 * problemRoutes.js
 * Routes for problems
 */
const express = require('express');
const { 
  createProblem, 
  getProblem, 
  getAllProblems,
  getProblemsByDifficulty,
  getProblemsByTag,
  searchProblems,
  refreshProblem
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for all problems
router.route('/')
  .post(protect, createProblem)
  .get(protect, getAllProblems);

// Routes for searching problems
router.route('/search/:keyword')
  .get(protect, searchProblems);

// Routes for filtering problems by difficulty
router.route('/difficulty/:difficulty')
  .get(protect, getProblemsByDifficulty);

// Routes for filtering problems by tag
router.route('/tag/:tag')
  .get(protect, getProblemsByTag);

// Routes for specific problem by ID
router.route('/:id')
  .get(protect, getProblem);

// Routes for refreshing problem data
router.route('/:id/refresh')
  .put(protect, refreshProblem);

module.exports = router;