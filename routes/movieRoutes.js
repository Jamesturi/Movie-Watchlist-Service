// routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');
const { validateMovie } = require('../middleware/movieValidation');

// Create a new movie with validation
router.post('/', auth, validateMovie, movieController.addMovie);

// Other routes remain the same
router.get('/', auth, movieController.getMovies);
router.get('/:id', validateObjectId, auth, movieController.getMovieById);
router.put('/:id', validateObjectId, auth, validateMovie, movieController.updateMovie);
router.delete('/:id', validateObjectId, auth, movieController.deleteMovie);

module.exports = router;