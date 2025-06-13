const express = require('express');
const router = express.Router();
const { validateMovie } = require('../middleware/validation');
const { addMovie, getMovies } = require('../controllers/movieController');
const auth = require('../middleware/auth');

// GET endpoint to retrieve user's watchlist - protected with auth middleware
router.get('/', auth, getMovies);

// POST endpoint to add a new movie - protected with auth middleware
router.post('/', auth, validateMovie, addMovie);

module.exports = router;