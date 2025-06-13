// routes/movieRoutes.js
const express = require('express');
const router = express.Router();

const { 
  addMovie, 
  getMovies, 
  getMovieById, 
  updateMovie, 
  deleteMovie 
} = require('../controllers/movieController');
const auth = require('../middleware/auth');

//— new imports —//
const { 
    validateMovie,
    validateObjectId,
  validateRequest, 
  validateRequestBody,
  sanitizeQueryParams 
} = require('../middleware/validation');
const { 
  movieCreateSchema, 
  movieUpdateSchema,
  movieQuerySchema 
} = require('../middleware/validationSchemas');


// GET endpoint to retrieve user's watchlist
// (original)                              auth, getMovies
// now with optional filtering/sanitization
router.get(
  '/', 
  auth,
  sanitizeQueryParams,
  validateRequest(movieQuerySchema, 'query'),
  getMovies
);


// POST endpoint to add a new movie
// (original)                              auth, validateMovie, addMovie
// now also ensuring non-empty body + schema-driven create
router.post(
  '/', 
  auth,
  validateRequestBody,
  validateRequest(movieCreateSchema, 'body'),
  validateMovie,
  addMovie
);


// GET endpoint to retrieve a specific movie by ID
// unchanged from your original
router.get(
  '/:id', 
  validateObjectId, 
  auth, 
  getMovieById
);


// PUT endpoint to update a movie
// (original)                              validateObjectId, auth, validateMovie, updateMovie
// now also non-empty body + schema-driven update
router.put(
  '/:id', 
  validateObjectId, 
  auth,
  validateRequestBody,
  validateRequest(movieUpdateSchema, 'body'),
  validateMovie,
  updateMovie
);


// DELETE endpoint to remove a movie from watchlist
// unchanged from your original
router.delete(
  '/:id', 
  validateObjectId, 
  auth, 
  deleteMovie
);


module.exports = router;
