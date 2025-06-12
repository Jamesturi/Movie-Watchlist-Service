const express = require('express');
const router = express.Router();
const { 
  getMovies, 
  getMovie, 
  createMovie, 
  updateMovie, 
  deleteMovie 
} = require('../controllers/movieController');
const auth = require('../middleware/auth');

// Protect all movie routes with auth middleware
router.use(auth);

// Get all movies & Create movie
router.route('/')
  .get(getMovies)
  .post(createMovie);

// Get, update, and delete movie by ID
router.route('/:id')
  .get(getMovie)
  .put(updateMovie)
  .delete(deleteMovie);

module.exports = router;