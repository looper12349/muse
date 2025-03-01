/**
 * problemService.js
 * Service for managing LeetCode problems
 */
const Problem = require('../models/problems');
const { LeetCodeScraper, extractProblemInfo } = require('../utils/leetcodeScraperUtils');

// Initialize the LeetCode scraper with custom options
const leetcodeScraper = new LeetCodeScraper({
  cacheExpiry: 7 * 24 * 60 * 60 * 1000, // Cache for 7 days
  minRequestInterval: 5000, // 5 seconds between requests in production
  // You can add proxy support if needed
  // proxy: 'http://your-proxy-service:port'
});

/**
 * Get or create a problem from a LeetCode URL
 */
const getOrCreateProblem = async (leetcodeUrl) => {
  try {
    // Check if problem already exists in our database
    let problem = await Problem.findOne({ leetcodeUrl });
    
    if (!problem) {
      // Extract problem information from URL
      const { problemSlug } = extractProblemInfo(leetcodeUrl);
      
      if (!problemSlug) {
        throw new Error('Invalid LeetCode URL: Could not extract problem slug');
      }
      
      // Fetch problem details using our robust scraper
      const problemDetails = await leetcodeScraper.getProblemDetails(leetcodeUrl);
      
      if (!problemDetails || !problemDetails.title || problemDetails.title === 'Unknown Problem') {
        throw new Error('Failed to fetch problem details from LeetCode');
      }
      
      // Create new problem
      problem = await Problem.create({
        leetcodeUrl,
        problemId: problemDetails.problemNumber || problemSlug,
        title: problemDetails.title,
        difficulty: problemDetails.difficulty,
        description: problemDetails.description,
        tags: problemDetails.tags,
        lastUpdated: new Date()
      });
      
      console.log(`Created new problem: ${problemDetails.title}`);
    } else {
      // Check if we need to update the problem (if it's older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (!problem.lastUpdated || problem.lastUpdated < thirtyDaysAgo) {
        console.log(`Updating stale problem data for: ${problem.title}`);
        
        // Fetch fresh data
        const freshDetails = await leetcodeScraper.getProblemDetails(leetcodeUrl);
        
        if (freshDetails && freshDetails.title !== 'Unknown Problem') {
          // Update the problem with fresh data
          problem.title = freshDetails.title;
          problem.difficulty = freshDetails.difficulty;
          problem.description = freshDetails.description;
          problem.tags = freshDetails.tags;
          problem.lastUpdated = new Date();
          
          await problem.save();
          console.log(`Updated problem data for: ${problem.title}`);
        }
      }
    }
    
    return problem;
  } catch (error) {
    console.error('Error in getOrCreateProblem:', error);
    throw error;
  }
};

/**
 * Get a problem by ID
 */
const getProblemById = async (problemId) => {
  try {
    const problem = await Problem.findOne({ 
      $or: [
        { _id: problemId },
        { problemId: problemId }
      ]
    });
    
    return problem;
  } catch (error) {
    console.error('Error in getProblemById:', error);
    throw error;
  }
};

/**
 * Get problems by difficulty
 */
const getProblemsByDifficulty = async (difficulty) => {
  try {
    const problems = await Problem.find({ difficulty });
    return problems;
  } catch (error) {
    console.error('Error in getProblemsByDifficulty:', error);
    throw error;
  }
};

/**
 * Get problems by tag
 */
const getProblemsByTag = async (tag) => {
  try {
    const problems = await Problem.find({ tags: tag });
    return problems;
  } catch (error) {
    console.error('Error in getProblemsByTag:', error);
    throw error;
  }
};

/**
 * Search problems by keyword
 */
const searchProblems = async (keyword) => {
  try {
    const regex = new RegExp(keyword, 'i');
    const problems = await Problem.find({
      $or: [
        { title: regex },
        { description: regex },
        { tags: regex }
      ]
    });
    return problems;
  } catch (error) {
    console.error('Error in searchProblems:', error);
    throw error;
  }
};

module.exports = {
  getOrCreateProblem,
  getProblemById,
  getProblemsByDifficulty,
  getProblemsByTag,
  searchProblems
};