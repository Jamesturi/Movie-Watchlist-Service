const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user (protected route)
router.get('/me', auth, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

module.exports = router;