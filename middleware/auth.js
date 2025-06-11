// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Check if no token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided or invalid format' 
      });
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by id
      const user = await User.findById(decoded.id).select('-password');
      
      // Check if user exists
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }
      
      // Attach user to request object
      req.user = user;
      next();
      
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = auth;