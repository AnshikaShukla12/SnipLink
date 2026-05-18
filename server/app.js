const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import Middlewares
const { apiLimiter, authLimiter, redirectLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Import Routers
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Import public controller for root redirection
const { redirectUrl } = require('./controllers/urlController');

const app = express();

// 1. Core Security Headers
app.use(helmet());

// 2. Enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// 3. Request Body Parsers (JSON & URL-encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Request Logging (Development environment only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 5. Register MVC Application Routers
app.use('/api/auth', authRoutes); // Auth limiter and JWT profiles mapped inside
app.use('/api/urls', apiLimiter, urlRoutes); // General API limiter + JWT CRUD guard
app.use('/api/analytics', apiLimiter, analyticsRoutes); // General API limiter + JWT analytics guard

// 6. Basic API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SnipLink API is running cleanly',
    timestamp: new Date(),
  });
});

// 7. PUBLIC REDIRECTION ENGINE (Root Wildcard Route)
// Must be registered after all main API groups so it does not swallow valid endpoints!
// Guarded with redirectLimiter to stop scraper bots scanning short codes.
app.get('/:shortId', redirectLimiter, redirectUrl);

// 8. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// 9. Global Error Handler Middleware (Must be registered last!)
app.use(errorHandler);

module.exports = app;
