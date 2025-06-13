const express = require('express');
const router = express.Router();
const { validateMovie, validateObjectId } = require('../middleware/validation');
const { addMovie, getMovies, getMovieById, updateMovie } = require('../controllers/movieController');
const auth = require('../middleware/auth');

// POST endpoint to add a new movie
router.post('/', auth, validateMovie, addMovie);

// GET endpoint to retrieve user's watchlist
router.get('/', auth, getMovies);

// GET endpoint to retrieve a specific movie by ID
router.get('/:id', validateObjectId, auth, getMovieById);

// routes/movieRoutes.js
// Update route with proper middleware
router.put('/:id', validateObjectId, auth, validateMovie, updateMovie);

module.exports = router;