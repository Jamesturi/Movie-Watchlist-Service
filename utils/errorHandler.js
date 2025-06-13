// utils/errorHandler.js

// Base error class for API errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

// 401 - Unauthorized
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

// 403 - Forbidden
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// 404 - Not Found
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 409 - Conflict
class ConflictError extends AppError {
  constructor(message = 'Conflict with current state') {
    super(message, 409);
  }
}

// 422 - Unprocessable Entity
class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 422);
  }
}

// 500 - Internal Server Error
class InternalServerError extends AppError {
  constructor(message = 'Something went wrong on the server') {
    super(message, 500);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError
};