
const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Request = require('../models/Request');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updates = req.body;
    const allowedUpdates = ['fullName', 'phone', 'licensePlate'];
    
    // Filter out invalid updates
    const updatesToApply = Object.keys(updates)
      .filter(update => allowedUpdates.includes(update))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updatesToApply,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get user request history
router.get('/requests', auth, async (req, res) => {
  try {
    if (req.userType !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const requests = await Request.find({ user: req.userId })
      .populate('helper', 'fullName phone rating')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Failed to get request history', error: error.message });
  }
});

module.exports = router;
