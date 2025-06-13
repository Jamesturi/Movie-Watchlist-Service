const express = require('express');
const router = express.Router();
const { validateMovie, validateObjectId } = require('../middleware/validation');
const { addMovie, getMovies, getMovieById } = require('../controllers/movieController');
const auth = require('../middleware/auth');

// POST endpoint to add a new movie
router.post('/', auth, validateMovie, addMovie);

// GET endpoint to retrieve user's watchlist
router.get('/', auth, getMovies);

// GET endpoint to retrieve a specific movie by ID
router.get('/:id', validateObjectId, auth, getMovieById);

module.exports = router;