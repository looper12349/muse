const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for thread for faster lookups
MessageSchema.index({ thread: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);