// const mongoose = require('mongoose');

// const ThreadSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   problem: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Problem',
//     required: true
//   },
//   title: {
//     type: String,
//     trim: true,
//     default: function() {
//       return `Thread ${this._id}`;
//     }
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   lastMessageAt: {
//     type: Date,
//     default: Date.now
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Add index for user and problem for faster lookups
// ThreadSchema.index({ user: 1, problem: 1 });

// module.exports = mongoose.model('Thread', ThreadSchema);


const mongoose = require('mongoose');
const { LLM_PROVIDERS } = require('../config/llmConfig');

const threadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  llmProvider: {
    type: String,
    enum: Object.keys(LLM_PROVIDERS),
    default: 'openai' // Default provider
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Auto-generate title if not provided
threadSchema.pre('save', async function(next) {
  if (!this.title && this.isNew) {
    // If the problem is populated
    if (this.problem && this.problem.title) {
      this.title = `Thread for ${this.problem.title}`;
    } else if (this.problem) {
      try {
        // Try to fetch the problem to get its title
        const Problem = mongoose.model('Problem');
        const problem = await Problem.findById(this.problem);
        if (problem) {
          this.title = `Thread for ${problem.title}`;
        } else {
          this.title = `New Thread ${new Date().toLocaleDateString()}`;
        }
      } catch (error) {
        this.title = `New Thread ${new Date().toLocaleDateString()}`;
      }
    } else {
      this.title = `New Thread ${new Date().toLocaleDateString()}`;
    }
  }
  next();
});

module.exports = mongoose.model('Thread', threadSchema);