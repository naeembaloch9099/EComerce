/**
 * Async Handler Utility
 * Wraps async functions to handle errors automatically
 * and pass them to Express error handling middleware
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
