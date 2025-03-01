/**
 * problemController.js
 * Controller for problem-related routes
 */
const Problem = require('../models/problems');
const { 
  getOrCreateProblem, 
  getProblemById, 
  getProblemsByDifficulty, 
  getProblemsByTag, 
  searchProblems 
} = require('../services/problemService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { isValidLeetCodeUrl } = require('../utils/validation');

// @desc    Get or create a problem from LeetCode URL
// @route   POST /api/problems
// @access  Private
exports.createProblem = asyncHandler(async (req, res, next) => {
  const { leetcodeUrl } = req.body;

  // Validate LeetCode URL
  if (!isValidLeetCodeUrl(leetcodeUrl)) {
    return res.status(400).json(new ApiResponse(false, null, 'Please provide a valid LeetCode URL'));
  }

  try {
    // Get or create problem
    const problem = await getOrCreateProblem(leetcodeUrl);
    res.status(201).json(new ApiResponse(true, { problem }, 'Problem retrieved/created successfully'));
  } catch (error) {
    console.error('Error in createProblem controller:', error);
    
    // Check if it's a scraping error
    if (error.message && error.message.includes('Failed to fetch problem details')) {
      return res.status(503).json(new ApiResponse(
        false, 
        null, 
        'Currently unable to fetch this problem from LeetCode. Please try again later.'
      ));
    }
    
    // Handle other errors
    return res.status(500).json(new ApiResponse(false, null, 'Error processing LeetCode problem'));
  }
});

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Private
exports.getProblem = asyncHandler(async (req, res, next) => {
  try {
    const problem = await getProblemById(req.params.id);

    if (!problem) {
      return res.status(404).json(new ApiResponse(false, null, 'Problem not found'));
    }

    res.status(200).json(new ApiResponse(true, { problem }, 'Problem retrieved successfully'));
  } catch (error) {
    console.error('Error in getProblem controller:', error);
    return res.status(500).json(new ApiResponse(false, null, 'Error retrieving problem'));
  }
});

// @desc    Get problems by difficulty
// @route   GET /api/problems/difficulty/:difficulty
// @access  Private
exports.getProblemsByDifficulty = asyncHandler(async (req, res, next) => {
  const { difficulty } = req.params;
  
  // Validate difficulty
  if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    return res.status(400).json(new ApiResponse(
      false, 
      null, 
      'Invalid difficulty level. Must be Easy, Medium, or Hard'
    ));
  }
  
  try {
    const problems = await getProblemsByDifficulty(difficulty);
    res.status(200).json(new ApiResponse(
      true, 
      { problems, count: problems.length }, 
      `${problems.length} ${difficulty} problems retrieved successfully`
    ));
  } catch (error) {
    console.error('Error in getProblemsByDifficulty controller:', error);
    return res.status(500).json(new ApiResponse(false, null, 'Error retrieving problems by difficulty'));
  }
});

// @desc    Get problems by tag
// @route   GET /api/problems/tag/:tag
// @access  Private
exports.getProblemsByTag = asyncHandler(async (req, res, next) => {
  const { tag } = req.params;
  
  try {
    const problems = await getProblemsByTag(tag);
    res.status(200).json(new ApiResponse(
      true, 
      { problems, count: problems.length }, 
      `${problems.length} problems with tag "${tag}" retrieved successfully`
    ));
  } catch (error) {
    console.error('Error in getProblemsByTag controller:', error);
    return res.status(500).json(new ApiResponse(false, null, 'Error retrieving problems by tag'));
  }
});

// @desc    Search problems
// @route   GET /api/problems/search/:keyword
// @access  Private
exports.searchProblems = asyncHandler(async (req, res, next) => {
  const { keyword } = req.params;
  
  if (!keyword || keyword.trim().length < 2) {
    return res.status(400).json(new ApiResponse(
      false, 
      null, 
      'Search keyword must be at least 2 characters long'
    ));
  }
  
  try {
    const problems = await searchProblems(keyword);
    res.status(200).json(new ApiResponse(
      true, 
      { problems, count: problems.length }, 
      `${problems.length} problems found matching "${keyword}"`
    ));
  } catch (error) {
    console.error('Error in searchProblems controller:', error);
    return res.status(500).json(new ApiResponse(false, null, 'Error searching problems'));
  }
});

// @desc    Refresh problem data from LeetCode
// @route   PUT /api/problems/:id/refresh
// @access  Private
exports.refreshProblem = asyncHandler(async (req, res, next) => {
  try {
    // First find the problem
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json(new ApiResponse(false, null, 'Problem not found'));
    }
    
    // Force a refresh by getting the problem again
    const refreshedProblem = await getOrCreateProblem(problem.leetcodeUrl);
    
    res.status(200).json(new ApiResponse(
      true, 
      { problem: refreshedProblem }, 
      'Problem data refreshed successfully'
    ));
  } catch (error) {
    console.error('Error in refreshProblem controller:', error);
    
    if (error.message && error.message.includes('Failed to fetch problem details')) {
      return res.status(503).json(new ApiResponse(
        false, 
        null, 
        'Currently unable to refresh this problem from LeetCode. Please try again later.'
      ));
    }
    
    return res.status(500).json(new ApiResponse(false, null, 'Error refreshing problem data'));
  }
});

// @desc    Get all problems (paginated)
// @route   GET /api/problems
// @access  Private
exports.getAllProblems = asyncHandler(async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;
    
    // Apply filters if present
    const filter = {};
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    // Get total count for pagination info
    const total = await Problem.countDocuments(filter);
    
    // Get problems with pagination
    const problems = await Problem.find(filter)
      .sort({ problemId: 1 }) // Sort by problem ID
      .skip(skip)
      .limit(limit);
    
    res.status(200).json(new ApiResponse(
      true, 
      { 
        problems, 
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        } 
      }, 
      `Retrieved ${problems.length} problems (page ${page} of ${Math.ceil(total / limit)})`
    ));
  } catch (error) {
    console.error('Error in getAllProblems controller:', error);
    return res.status(500).json(new ApiResponse(false, null, 'Error retrieving problems'));
  }
});

module.exports = exports;