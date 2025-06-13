const Movie = require('../models/Movie');

// Controller to add a new movie to the watchlist
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


// Get all movies for the authenticated user
exports.getMovies = async (req, res) => {
  try {
    // Find all movies that belong to the authenticated user
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