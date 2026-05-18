const rateLimit = require('express-rate-limit');

/**
 * Tier 1: General API Route Rate Limiter.
 * Protects database query endpoints from general request flooding.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many API requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true, // Return standard rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers (deprecated)
});

/**
 * Tier 2: Strict Authentication Rate Limiter.
 * Mitigates dictionary/brute-force attacks against user logins and registrations.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 20, // Limit each IP to 20 auth attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Tier 3: Redirection Crawler Rate Limiter.
 * Allows high volume redirection traffic but mitigates crawlers from scanning shortIds in rapid succession.
 */
const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 60, // Limit each IP to 60 redirects per minute
  message: {
    success: false,
    message: 'Too many redirection requests. Please wait a moment before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  redirectLimiter,
};
