// middleware/validation.js
const Joi = require('joi');
const mongoose = require('mongoose');
const { ValidationError, BadRequestError } = require('../utils/errorHandler');

// Movie validation schema
const movieSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Movie title is required',
    'any.required': 'Movie title is required'
  }),
  year: Joi.number()
    .integer()
    .min(1888)
    .max(new Date().getFullYear() + 5)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.min': 'Year must be at least 1888',
      'number.max': `Year cannot be more than ${new Date().getFullYear() + 5}`,
      'any.required': 'Release year is required'
    }),
  watched: Joi.boolean().default(false)
});



// Generic validation middleware creator
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true // remove any keys not in schema
    });

    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return next(new ValidationError(message));
    }

    // replace the original data with the validated & sanitized value
    req[property] = value;
    next();
  };
};

// Specific middlewares
const validateMovie = validateRequest(movieSchema, 'body');
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new BadRequestError('Invalid ID format'));
  }
  next();
};

// Ensure body is present
const validateRequestBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new BadRequestError('Request body cannot be empty'));
  }
  next();
};

// Sanitize & coerce query parameters
const sanitizeQueryParams = (req, res, next) => {
  if (req.query) {
    if (req.query.watched !== undefined) {
      req.query.watched = req.query.watched === 'true';
    }
    if (req.query.year !== undefined) {
      const y = parseInt(req.query.year, 10);
      if (!isNaN(y)) req.query.year = y;
    }
    if (req.query.limit !== undefined) {
      const l = parseInt(req.query.limit, 10);
      if (!isNaN(l)) req.query.limit = l;
    }
    if (req.query.page !== undefined) {
      const p = parseInt(req.query.page, 10);
      if (!isNaN(p)) req.query.page = p;
    }
  }
  next();
};

module.exports = {
  validateMovie,
  validateRequest,
  validateObjectId,
  validateRequestBody,
  sanitizeQueryParams
};
