// utils/asyncHandler.js
/**
 * Wraps async controller functions to catch errors and pass them to Express error handler
 * @param {Function} fn - The async controller function
 * @returns {Function} - Express middleware function
 */
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(next);  // This passes any errors to the Express error handler
};

module.exports = asyncHandler;