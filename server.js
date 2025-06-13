// server.js (modified)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const { NotFoundError } = require('./utils/errorHandler');
// server.js (add near the top with other middleware)
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet')

const rateLimit = require('express-rate-limit');

// Create Express app
const app = express();
// Load environment variables
dotenv.config();

// Connect to MongoDB
// const connectDB = async () => {
//   try {
//     // Remove deprecated options
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//       // Removed deprecated options: useCreateIndex, useFindAndModify
//     });
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     // Exit process with failure
//     process.exit(1);
//   }
// };

connectDB();



// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const testRoutes = require('./routes/testRoutes'); // New test routes

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/test', testRoutes); // Mount test routes

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use('/api/', limiter);

// Apply stricter rate limiting to auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 login attempts per hour
  message: 'Too many login attempts from this IP, please try again after an hour'
});

app.use('/api/auth/login', authLimiter);
// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Handle undefined routes
// app.all('*', (req, res, next) => {
//   next(new NotFoundError(`Cannot find ${req.originalUrl} on this server`));
// });

// Global error handler middleware (must be after routes)
app.use(errorMiddleware);



// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});