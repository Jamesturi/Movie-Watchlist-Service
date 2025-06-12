const Movie = require('../models/Movie');

// Get all movies for the logged-in user
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Get movies error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get a single movie by ID
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    // Check if movie exists
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Check if user owns the movie
    if (movie.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this movie'
      });
    }
    
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Get movie error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    // Add user ID to movie data
    const movieData = {
      ...req.body,
      user: req.user.id
    };
    
    // Create the movie
    const movie = await Movie.create(movieData);
    
    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    let movie = await Movie.findById(req.params.id);
    
    // Check if movie exists
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Check if user owns the movie
    if (movie.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this movie'
      });
    }
    
    // Update the movie
    movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Update movie error:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    // Check if movie exists
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }
    
    // Check if user owns the movie
    if (movie.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this movie'
      });
    }
    
    await movie.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete movie error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};