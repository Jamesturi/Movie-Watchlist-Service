const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Import movie routes
const movieRoutes = require('./routes/movieRoutes');



// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

// Initialize middleware
app.use(express.json());               // Body parser for JSON data
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data
app.use(cors());                       // Enable CORS for all routes

// Import routes
const authRoutes = require('./routes/authRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Movie Watchlist API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
