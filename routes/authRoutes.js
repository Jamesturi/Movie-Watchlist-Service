const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth');
const {validateRequest} = require('../middleware/validation');
const { 
  userRegistrationSchema, 
  userLoginSchema 
} = require('../middleware/validationSchemas');


// // Register route
// router.post('/register', register);

// // Login route
// router.post('/login', login);


// Register new user
router.post('/register', validateRequest(userRegistrationSchema), register);

// Login user
router.post('/login', validateRequest(userLoginSchema), login);

// Protected route to test auth middleware
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is already attached by the middleware
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;