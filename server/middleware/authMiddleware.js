const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/user');
const { JWT_SECRET } = require('../config/env');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json(new ApiResponse(false, null, 'Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json(new ApiResponse(false, null, 'User not found'));
    }
    
    next();
  } catch (err) {
    return res.status(401).json(new ApiResponse(false, null, 'Not authorized to access this route'));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(new ApiResponse(false, null, 'Not authorized to access this route'));
    }
    next();
  };
};