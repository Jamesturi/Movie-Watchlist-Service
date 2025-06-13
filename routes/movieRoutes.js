const express = require('express');
const router = express.Router();
const { validateMovie } = require('../middleware/validation');
const { addMovie } = require('../controllers/movieController');
const auth = require('../middleware/auth'); // Using our existing auth middleware

// POST endpoint to add a new movie - protected with auth middleware
router.post('/', auth, validateMovie, addMovie);

module.exports = router;