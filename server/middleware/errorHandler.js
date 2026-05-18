/**
 * Global Consolidated Error Handling Middleware.
 * Intercepts, formats, and standardizes all database and runtime exceptions.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log full stack trace in the terminal for developer diagnostics
  console.error('❌ Error caught by global handler:', err.stack || err.message);

  // --- Mongoose Bad ObjectId (e.g. searching for /api/urls/invalidID) ---
  if (err.name === 'CastError') {
    error.message = 'Resource not found: Invalid ID format';
    return res.status(404).json({ success: false, message: error.message });
  }

  // --- Mongoose Duplicate Key (e.g. registering duplicate email, custom alias) ---
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    // Capitalize field name for clean display
    const formattedField = duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1);
    error.message = `${formattedField} is already registered. Please choose another.`;
    return res.status(400).json({ success: false, message: error.message });
  }

  // --- Mongoose Schema Validation Failure (e.g. missing required field, weak password) ---
  if (err.name === 'ValidationError') {
    // Map individual validation fields into a single readable string
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(', ');
    return res.status(400).json({ success: false, message: error.message });
  }

  // --- JWT Invalid Token (e.g. forged signature) ---
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid authentication token. Please sign in again.';
    return res.status(401).json({ success: false, message: error.message });
  }

  // --- JWT Expired Token (e.g. older than 7d) ---
  if (err.name === 'TokenExpiredError') {
    error.message = 'Your session has expired. Please sign in again.';
    return res.status(401).json({ success: false, message: error.message });
  }

  // --- Final Production Fallback (General Server Errors) ---
  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error. Please contact support.',
  });
};

module.exports = errorHandler;
