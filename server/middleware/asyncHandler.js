/**
 * High-Order Function to eliminate try-catch boilerplate in asynchronous controllers/middlewares.
 * It wraps the async function, resolves it, and catches any rejected promise, passing it to next().
 * 
 * @param {Function} fn - The asynchronous middleware or controller function.
 * @returns {Function} - A standard Express middleware function.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
