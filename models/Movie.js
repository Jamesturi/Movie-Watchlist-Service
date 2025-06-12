const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  releaseYear: {
    type: Number
  },
  watched: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;