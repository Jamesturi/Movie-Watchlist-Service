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