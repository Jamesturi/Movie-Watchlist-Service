// middleware/joiValidation.js
const Joi = require('joi');
const { ValidationError } = require('../utils/errorTypes');

// Create a middleware factory that takes a validation schema
const createValidator = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,  // Collect all errors, not just the first one
      stripUnknown: true  // Remove unknown elements from the validated object
    });

    if (error) {
      // Map Joi validation errors to our standard format
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, '')
      }));

      // Pass the error to our central handler
      return next(new ValidationError('Validation failed', validationErrors));
    }

    // If validation passes, pass validated data to the controller
    req.validatedData = schema.validate(req.body, { stripUnknown: true }).value;
    next();
  };
};

// Define schemas for different resources
const schemas = {
  movie: Joi.object({
    title: Joi.string().required().trim().max(100),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 5).required(),
    watched: Joi.boolean().default(false)
  }),
  
  // Add other schemas as needed
  user: Joi.object({
    name: Joi.string().required().trim().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  })
};

// Export validator middleware factory and schemas
module.exports = {
  validate: createValidator,
  schemas
};