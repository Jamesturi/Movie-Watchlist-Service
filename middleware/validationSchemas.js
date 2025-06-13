// middleware/validationSchemas.js
const Joi = require('joi');
const { ValidationError } = require('../utils/errorHandler');

// User validation schemas
const userRegistrationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'string.empty': 'Name is required',
      'any.required': 'Name is required'
    }),
  email: Joi.string().trim().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(8).max(100).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 100 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

const userLoginSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

// Movie validation schemas
const movieCreateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required()
    .messages({
      'string.min': 'Movie title cannot be empty',
      'string.max': 'Movie title cannot exceed 255 characters',
      'string.empty': 'Movie title is required',
      'any.required': 'Movie title is required'
    }),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 5).required()
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be at least 1888 (first motion picture)',
      'number.max': `Year cannot be more than ${new Date().getFullYear() + 5} (near future)`,
      'any.required': 'Release year is required'
    }),
  watched: Joi.boolean().default(false)
    .messages({
      'boolean.base': 'Watched status must be true or false'
    })
});

const movieUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255)
    .messages({
      'string.min': 'Movie title cannot be empty',
      'string.max': 'Movie title cannot exceed 255 characters'
    }),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 5)
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be at least 1888 (first motion picture)',
      'number.max': `Year cannot be more than ${new Date().getFullYear() + 5} (near future)`
    }),
  watched: Joi.boolean()
    .messages({
      'boolean.base': 'Watched status must be true or false'
    })
}).min(1).messages({ 'object.min': 'At least one field must be provided for update' });

// Query parameter schemas
const movieQuerySchema = Joi.object({
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 5),
  watched: Joi.boolean(),
  title: Joi.string().trim().max(255),
  sort: Joi.string().valid('title', 'year', 'watched', 'createdAt', '-title', '-year', '-watched', '-createdAt'),
  limit: Joi.number().integer().min(1).max(100).default(20),
  page: Joi.number().integer().min(1).default(1)
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  movieCreateSchema,
  movieUpdateSchema,
  movieQuerySchema
};