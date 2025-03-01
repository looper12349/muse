/**
 * Problem.js
 * MongoDB model for LeetCode problems
 */
const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  // LeetCode URL
  leetcodeUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Problem ID (can be number or slug)
  problemId: {
    type: String,
    required: true,
    index: true
  },
  
  // Problem title
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Unknown'],
    default: 'Unknown'
  },
  
  // Problem description (HTML content)
  description: {
    type: String,
    required: true
  },
  
  // Problem tags
  tags: [{
    type: String,
    trim: true
  }],
  
  // Last updated timestamp
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Additional metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Track scraping attempts
  scrapingAttempts: {
    type: Number,
    default: 0
  },
  
  // Last scraping error
  scrapingError: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Add text index for better search
ProblemSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

const Problem = mongoose.model('Problem', ProblemSchema);

module.exports = Problem;