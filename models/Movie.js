const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  year: {
    type: Number,
    validate: {
      validator: function(value) {
        return !value || (value > 1888 && value <= new Date().getFullYear());
      },
      message: props => `${props.value} is not a valid release year!`
    }
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
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;