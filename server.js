require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

// Route imports
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com' // Production domain
    : 'http://localhost:3000',  // Development domain
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlists', watchlistRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Movie Watchlist API is running');
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
