
const express = require('express');
const Helper = require('../models/Helper');
const Request = require('../models/Request');
const auth = require('../middleware/auth');
const router = express.Router();

// Get helper profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const helper = await Helper.findById(req.userId).select('-password');
    
    if (!helper) {
      return res.status(404).json({ message: 'Helper not found' });
    }
    
    res.json(helper);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
});

// Update helper profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updates = req.body;
    const allowedUpdates = ['fullName', 'phone', 'services', 'vehicleInfo'];
    
    // Filter out invalid updates
    const updatesToApply = Object.keys(updates)
      .filter(update => allowedUpdates.includes(update))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    const helper = await Helper.findByIdAndUpdate(
      req.userId,
      updatesToApply,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!helper) {
      return res.status(404).json({ message: 'Helper not found' });
    }
    
    res.json(helper);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Update helper availability
router.post('/availability', auth, async (req, res) => {
  try {
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { isAvailable, location } = req.body;
    
    const updates = { isAvailable };
    
    // If location is provided, update it
    if (location && location.coordinates) {
      updates.location = {
        type: 'Point',
        coordinates: location.coordinates
      };
    }
    
    const helper = await Helper.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true }
    );
    
    if (!helper) {
      return res.status(404).json({ message: 'Helper not found' });
    }
    
    res.json({ isAvailable: helper.isAvailable });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
});

// Get helper earnings
router.get('/earnings', auth, async (req, res) => {
  try {
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get all completed requests with payments
    const completedRequests = await Request.find({
      helper: req.userId,
      status: 'completed',
      'payment.status': 'completed'
    });
    
    // Calculate earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(today.getDate() - today.getDay());
    thisWeek.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const todayEarnings = completedRequests
      .filter(req => new Date(req.completedAt) >= today)
      .reduce((sum, req) => sum + req.payment.amount, 0);
    
    const weekEarnings = completedRequests
      .filter(req => new Date(req.completedAt) >= thisWeek)
      .reduce((sum, req) => sum + req.payment.amount, 0);
    
    const monthEarnings = completedRequests
      .filter(req => new Date(req.completedAt) >= thisMonth)
      .reduce((sum, req) => sum + req.payment.amount, 0);
    
    const totalEarnings = completedRequests
      .reduce((sum, req) => sum + req.payment.amount, 0);
    
    res.json({
      today: todayEarnings,
      week: weekEarnings,
      month: monthEarnings,
      total: totalEarnings
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ message: 'Failed to get earnings data', error: error.message });
  }
});

module.exports = router;
