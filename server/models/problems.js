const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  leetcodeUrl: {
    type: String,
    required: [true, 'Please provide the LeetCode URL'],
    trim: true
  },
  problemId: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Unknown'],
    default: 'Unknown'
  },
  description: {
    type: String
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for leetcodeUrl for faster lookups
ProblemSchema.index({ leetcodeUrl: 1 });

module.exports = mongoose.model('Problem', ProblemSchema);