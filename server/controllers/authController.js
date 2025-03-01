const User = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { isValidEmail } = require('../utils/validation');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;


  // Validate email & password
  if (!name || !email || !password ) {
    return res.status(400).json(new ApiResponse(false, null, 'Please provide a name, email and password'));
  }

  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json(new ApiResponse(false, null, 'Please provide a valid email'));
  }

  // check if the user is already registered
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json(new ApiResponse(false, null, 'User already exists'));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(201).json(new ApiResponse(true, { token }, 'User registered successfully'));
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json(new ApiResponse(false, null, 'Please provide an email and password'));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json(new ApiResponse(false, null, 'Invalid credentials'));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json(new ApiResponse(false, null, 'Invalid credentials'));
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(200).json(new ApiResponse(true, { token }, 'Login successful'));
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json(new ApiResponse(true, { user }, 'User retrieved successfully'));
});