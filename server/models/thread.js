const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
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
    trim: true,
    default: function() {
      return `Thread ${this._id}`;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for user and problem for faster lookups
ThreadSchema.index({ user: 1, problem: 1 });

module.exports = mongoose.model('Thread', ThreadSchema);