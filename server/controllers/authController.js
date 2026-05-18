const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Generate a cryptographically signed JWT Token
 * @param {string} id - The MongoDB User ID
 * @returns {string} - Signed JWT string
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user account
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1. Double check email uniqueness inside the controller (improves error response speed)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'This email is already registered. Please login or use a different email.',
    });
  }

  // 2. Create the User. Mongoose validation rules will run here.
  // The pre-save hook inside User.js will automatically hash the password.
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. Generate a fresh JWT session token for the user
  const token = signToken(user._id);

  // 4. Return JWT and User details (excluding password)
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      urlCount: user.urlCount,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Authenticate User & Issue Token
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validate basic input presence
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password',
    });
  }

  // 2. Query user by email. We must explicitly append '+password' 
  // because we hid it by default (select: false) inside the User schema.
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please check your email and password.',
    });
  }

  // 3. Verify the user's password using our schema's comparePassword instance method
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please check your email and password.',
    });
  }

  // 4. Generate a fresh JWT session token
  const token = signToken(user._id);

  // 5. Send successful login response
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      urlCount: user.urlCount,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // Since our 'auth' middleware has already run, validated the token,
  // and hydrated req.user, we can fetch the user details instantly without a DB hit!
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      urlCount: user.urlCount,
      createdAt: user.createdAt,
    },
  });
});
