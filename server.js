// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Health‐check endpoint (useful for Model A testing)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Movies endpoint for Model B’s MovieList component
app.get('/api/movies', async (_req, res) => {
  try {
    // If you have a Movie model, you could fetch from MongoDB:
    // const movies = await Movie.find();
    // For now, return a static list:
    const movies = [
      { id: 1, title: 'The Shawshank Redemption' },
      { id: 2, title: 'Inception' },
      { id: 3, title: 'Interstellar' },
    ];
    res.json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
