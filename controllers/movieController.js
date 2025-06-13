const Movie = require('../models/Movie');

// Controller to add a new movie to the watchlist (existing code)
exports.addMovie = async (req, res) => {
  try {
    const { title, year, watched = false } = req.body;
    
    // Create a new movie associated with the authenticated user
    const movie = new Movie({
      title,
      year,
      watched,
      user: req.user.id // This comes from our auth middleware
    });
    
    const savedMovie = await movie.save();
    
    res.status(201).json({
      success: true,
      data: savedMovie
    });
  } catch (error) {
    console.error('Error adding movie:', error.message);
    
    // Handle mongoose validation errors differently
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map(val => val.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all movies for the authenticated user (existing code)
exports.getMovies = async (req, res) => {
  try {
    // Find all movies associated with the logged-in user
    const movies = await Movie.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Error retrieving movies:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a specific movie by ID (new code)
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      user: req.user.id  // Enforce ownership - only return if it belongs to this user
    });
    
    // Check if movie exists
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error retrieving movie:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};


// controllers/movieController.js
// Update a movie
// Improved updateMovie controller with versioning
exports.updateMovie = async (req, res) => {
  try {
    const { title, year, watched } = req.body;
    
    // First fetch the movie with its current version
    const currentMovie = await Movie.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!currentMovie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    
    // Update with version check
    const movie = await Movie.findOneAndUpdate(
      { 
        _id: req.params.id,
        user: req.user.id,
        __v: currentMovie.__v // Ensure version match
      },
      { 
        $set: { title, year, watched }
      },
      { 
        new: true,
        runValidators: true
      }
    );
    
    // If movie is null, it means the version changed during our operation
    if (!movie) {
      return res.status(409).json({
        success: false,
        error: 'Conflict: The movie was modified by another request'
      });
    }
    
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    // Error handling same as before
    console.error('Error updating movie:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(val => val.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};