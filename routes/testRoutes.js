// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { 
  AppError, 
  BadRequestError, 
  NotFoundError, 
  ValidationError 
} = require('../utils/errorHandler');

// Test route that throws a synchronous error
router.get('/sync-error', (req, res) => {
  throw new Error('Test synchronous error');
});

// Test route that throws an async error
router.get('/async-error', async (req, res, next) => {
  try {
    // Simulate an asynchronous operation that fails
    await new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Test async error')), 100);
    });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
});

// Test route for database validation error
router.get('/db-validation', (req, res, next) => {
  // Simulate a database validation error
  const error = new ValidationError('Title is required and must be at least 2 characters');
  next(error);
});

// Test route for 404 error
router.get('/not-found', (req, res, next) => {
  next(new NotFoundError('The requested resource could not be found'));
});

// Test route for bad request error
router.get('/bad-request', (req, res, next) => {
  next(new BadRequestError('Invalid parameters provided'));
});

// Test route that doesn't handle a promise rejection
router.get('/unhandled-rejection', (req, res) => {
  // This will be caught by our unhandledRejection handler
  Promise.reject(new Error('Unhandled promise rejection'));
  
  // This line won't execute due to the unhandled rejection
  res.status(200).json({ success: true });
});

module.exports = router;