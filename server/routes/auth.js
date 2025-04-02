const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Helper = require('../models/Helper');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Validate token endpoint
router.get('/validate', verifyToken, async (req, res) => {
  try {
    const { id, userType } = req.user;
    
    // Find user based on type
    const Model = userType === 'helper' ? Helper : User;
    const user = await Model.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ message: 'Error validating token' });
  }
});

// Validation middleware
const validateRegistration = (req, res, next) => {
  const { userType, ...userData } = req.body;
  
  // Common validation for both user types
  if (!userData.fullName || userData.fullName.length < 2 || userData.fullName.length > 50) {
    return res.status(400).json({ message: 'Invalid full name' });
  }
  
  if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  
  if (!userData.phone || !/^[0-9+\s-()]{10,}$/.test(userData.phone)) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }
  
  if (!userData.password || userData.password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  
  // Validate password strength
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
    return res.status(400).json({ 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    });
  }
  
  // Type-specific validation
  if (userType === 'customer') {
    if (!userData.driverLicense || !/^[A-Z0-9-]{5,}$/.test(userData.driverLicense)) {
      return res.status(400).json({ message: 'Invalid driver license number' });
    }
    
    if (!userData.licensePlate || !/^[A-Z0-9-]{2,}$/.test(userData.licensePlate)) {
      return res.status(400).json({ message: 'Invalid license plate number' });
    }
  } else if (userType === 'helper') {
    if (!userData.services || !Array.isArray(userData.services) || userData.services.length === 0) {
      return res.status(400).json({ message: 'At least one service must be selected' });
    }
    
    if (!userData.experience || userData.experience.length < 10) {
      return res.status(400).json({ message: 'Please provide more details about your experience' });
    }
    
    if (!userData.vehicleInfo || userData.vehicleInfo.length < 5) {
      return res.status(400).json({ message: 'Vehicle information is required' });
    }
  } else {
    return res.status(400).json({ message: 'Invalid user type' });
  }
  
  next();
};

// Register user
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { userType, ...userData } = req.body;
    
    // Add detailed logging
    console.log('Registration attempt with data:', {
      userType,
      ...userData,
      password: '***hidden***'
    });
    
    // Validate required fields based on userType
    if (userType === 'customer' && (!userData.driverLicense || !userData.licensePlate)) {
      return res.status(400).json({ 
        message: 'Driver license and license plate are required for customers' 
      });
    }
    
    // Check if email already exists in either collection
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    const existingHelper = await Helper.findOne({ email: userData.email.toLowerCase() });
    
    if (existingUser || existingHelper) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user with proper error handling
    let newUser;
    try {
      if (userType === 'helper') {
        newUser = new Helper({ ...userData, userType });
      } else {
        newUser = new User({ ...userData, userType });
      }
      await newUser.save();
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(validationError.errors).map(err => err.message)
      });
    }

    res.status(201).json({ 
      message: 'Registration successful',
      userId: newUser._id 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message,
      details: error.errInfo?.details 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    let user;
    
    if (userType === 'helper') {
      user = await Helper.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;
