const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth'); // JWT token authentication guard
const { authLimiter } = require('../middleware/rateLimiter'); // IP brute-force limiter

// --- Public Access Routes (with Rate Limiting Protection) ---
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// --- Private / Protected Access Routes (Guarded by JWT Auth Middleware) ---
router.get('/me', auth, getMe);

module.exports = router;
