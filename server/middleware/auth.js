
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Helper = require('../models/Helper');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a user or helper
    if (decoded.userType === 'helper') {
      const helper = await Helper.findById(decoded.id);
      
      if (!helper) {
        return res.status(401).json({ message: 'Helper not found' });
      }
      
      req.helper = helper;
      req.userId = helper._id;
      req.userType = 'helper';
    } else {
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = user;
      req.userId = user._id;
      req.userType = 'customer';
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;
