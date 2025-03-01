const ApiResponse = require('../utils/apiResponse');
const { NODE_ENV } = require('../config/env');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json(new ApiResponse(false, null, 'Resource not found'));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json(new ApiResponse(false, null, 'Duplicate field value entered'));
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json(new ApiResponse(false, null, message));
  }

  // Send detailed error in development, generic in production
  const statusCode = err.statusCode || 500;
  const errorResponse = new ApiResponse(
    false,
    NODE_ENV === 'development' ? { stack: err.stack } : null,
    err.message || 'Server Error'
  );
  
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;