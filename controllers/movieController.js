// controllers/movieController.js (using new error handling)
const Movie = require('../models/Movie');
const { 
  BadRequestError, 
  NotFoundError, 
  ConflictError, 
  InternalServerError 
} = require('../utils/errorHandler');

// Controller to add a new movie to the watchlist
exports.addMovie = async (req, res, next) => {
  try {
    const { title, year, watched = false } = req.body;
    
    // Create a new movie associated with the authenticated user
    const movie = new Movie({
      title,
      year,
      watched,
      user: req.user.id
    });
    
    const savedMovie = await movie.save();
    
    res.status(201).json({
      success: true,
      data: savedMovie
    });
  } catch (error) {
    // Let the global handler process Mongoose validation errors
    next(error);
  }
};

// controllers/movieController.js (updated getMovies function)
exports.getMovies = async (req, res, next) => {
  try {
    const { 
      year, 
      watched, 
      title, 
      sort = '-createdAt', 
      page = 1, 
      limit = 20 
    } = req.query;
    
    // Build query filter
    const filter = { user: req.user.id };
    
    // Add optional filters if provided
    if (year !== undefined) filter.year = year;
    if (watched !== undefined) filter.watched = watched;
    if (title !== undefined) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with filters and pagination
    const movies = await Movie.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await Movie.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: movies.length,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data: movies
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific movie by ID
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!movie) {
      return next(new NotFoundError('Movie not found'));
    }
    
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// Update a movie
exports.updateMovie = async (req, res, next) => {
  try {
    const { title, year, watched } = req.body;
    
    const currentMovie = await Movie.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!currentMovie) {
      return next(new NotFoundError('Movie not found'));
    }
    
    // Update with version check
    const movie = await Movie.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.user.id, 
        __v: currentMovie.__v 
      },
      { $set: { title, year, watched } },
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return next(new ConflictError('Conflict: The movie was modified by another request'));
    }
    
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
};

// Delete a movie from watchlist
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!movie) {
      return next(new NotFoundError('Movie not found'));
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};