// middleware/movieValidation.js
const { body, validationResult } = require('express-validator');

// Middleware to validate movie creation/update data
exports.validateMovie = [
  body('title')
    .trim()
    .not().isEmpty().withMessage('Movie title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  
  body('year')
    .not().isEmpty().withMessage('Year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 5}`),
  
  body('watched')
    .optional()
    .isBoolean().withMessage('Watched status must be a boolean value'),

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];