const Joi = require('joi');

// Movie validation schema
const movieSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Movie title is required',
    'any.required': 'Movie title is required'
  }),
  year: Joi.number().integer().min(1888).max(new Date().getFullYear() + 5).required().messages({
    'number.base': 'Year must be a number',
    'number.min': 'Year must be at least 1888',
    'number.max': `Year cannot be more than ${new Date().getFullYear() + 5}`,
    'any.required': 'Release year is required'
  }),
  watched: Joi.boolean().default(false)
});

// Middleware for validating movie data
const validateMovie = (req, res, next) => {
  const { error } = movieSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }
  
  next();
};

module.exports = { validateMovie };