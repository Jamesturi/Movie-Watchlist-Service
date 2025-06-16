// middleware/errorHandler.js
const { AppError } = require('../utils/errorTypes');

// Handle Joi validation errors - these come directly from Joi
const handleJoiValidationError = (err) => {
  const errors = err.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message.replace(/['"]/g, '')
  }));
  
  return new ValidationError('Validation failed', errors);
};

// Handle Mongoose validation errors
const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map(error => ({
    field: error.path,
    message: error.message
  }));
  
  return new ValidationError('Validation failed', errors);
};


// Development error response
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

// Production error response
const sendErrorProd = (err, res) => {
  // Operational, trusted errors: send details to client
  if (err.isOperational) {
    // Handle validation errors differently to maintain consistent format
    if (err.errors && Array.isArray(err.errors)) {
      return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        errors: err.errors
      });
    }
    
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }
  
  // Programming or unknown errors: don't leak error details
  console.error('ERROR 💥', err);
  res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong'
  });
};

// Handle MongoDB duplicate key errors
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value for field "${field}": ${value}. Please use another value.`;
  return new AppError(message, 400);
};

// Handle MongoDB validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message
  }));
  const message = `Invalid input data.`;
  return new ValidationError(message, errors);
};

// Handle invalid MongoDB IDs
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () => new UnauthorizedError('Invalid token. Please log in again.');
const handleJWTExpiredError = () => new UnauthorizedError('Your token has expired. Please log in again.');

// Handle express-validator errors 
const handleExpressValidatorError = (err) => {
  // express-validator errors are already in our format in the middleware
  // but in case they slip through elsewhere:
  if (Array.isArray(err.array) && typeof err.array === 'function') {
    const errors = err.array().map(error => ({
      field: error.param,
      message: error.msg
    }));
    
    return new ValidationError('Validation failed', errors);
  }
  
  return err;
};

// Main error handling middleware (updated section)
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Clone the error object to avoid modifying the original
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message; // Message might be lost in stringify/parse
    
    // Handle specific error types - extended handling for more validation errors
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      error = handleMongooseValidationError(err);
    } else if (err.isJoi === true) {
      // Joi validation error
      error = handleJoiValidationError(err);
    } else if (err.array && typeof err.array === 'function') {
      // Express-validator error
      error = handleExpressValidatorError(err);
    } else if (err.code === 11000) {
      // MongoDB duplicate key error
      error = handleDuplicateKeyError(err);
    } else if (err.name === 'CastError') {
      // MongoDB bad ObjectId
      error = handleCastError(err);
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      // JWT errors
      error = err.name === 'TokenExpiredError' 
        ? handleJWTExpiredError() 
        : handleJWTError();
    }

    sendErrorProd(error, res);
  }
};

// Handle 404 errors for undefined routes
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
  next(error);
};

module.exports = { errorHandler, notFoundHandler };