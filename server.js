const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Development CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' // Production domain
    : 'http://localhost:3000',  // Development domain
  credentials: true,
  optionsSuccessStatus: 200
};

// // Production CORS with multiple allowed origins
// const allowedOrigins = [
//   'https://yourdomain.com',
//   'https://www.yourdomain.com',
//   'https://admin.yourdomain.com'
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl, etc.)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true); // Origin allowed
//     } else {
//       callback(new Error('Not allowed by CORS')); // Origin not allowed
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));

app.use(cors(corsOptions));

// // Enable CORS for all routes
// app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Movie Watchlist API is running');
});

// Listen on specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});