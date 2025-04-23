const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin
    if (decoded.userType !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const admin = await Admin.findById(decoded.id);
    
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    
    // Set admin data on request object
    req.admin = admin;
    req.userId = admin._id;
    req.userType = 'admin';
    req.isAdmin = true;
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = adminAuth;
