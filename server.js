const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for your React client
app.use(
  cors({
    origin: 'http://localhost:3000',  // allow this origin
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true                  // allow cookies (if needed)
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
connectDB();

// Import routes
const authRoutes  = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Basic route for testing reachability
app.get('/', (req, res) => {
  res.send('Movie Watchlist API is running');
});

// Ping endpoint for proxy tests
app.get('/api/ping', (req, res) => {
  res.json({ pong: true });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
