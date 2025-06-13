// models/Movie.js (updated)
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
    min: [1888, 'Year must be at least 1888']
  },
  watched: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true,
  // Enable optimistic concurrency control
  optimisticConcurrency: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;