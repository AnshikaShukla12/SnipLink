const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

/**
 * JWT Authentication Guard Middleware.
 * Decrypts Bearer token from header, validates user existence, and populates req.user.
 */
const auth = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization Header and follows Bearer pattern
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <TOKEN>"
  }

  // 2. Validate token existence
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: No authentication token provided',
    });
  }

  try {
    // 3. Cryptographically verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Hydrate req.user from MongoDB database (excluding password field)
    const user = await User.findById(decoded.id);

    // 5. Ensure user still exists in the system
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: The user owning this token no longer exists',
      });
    }

    // 6. Bind Mongoose document object to request for direct controller access
    req.user = user;
    next(); // Pass control to the next middleware or controller in queue
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Invalid or expired authentication token',
    });
  }
});

module.exports = auth;
