const express = require('express');
const router = express.Router();
const earningsService = require('../services/earningsService');
const auth = require('../middleware/auth');

// Get helper earnings summary
router.get('/summary', auth, async (req, res) => {
  try {
    const helperId = req.userId;
    
    // Check if the user is a helper
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Get the helper's earnings
    const earnings = await earningsService.getHelperEarnings(helperId);
    
    res.json(earnings);
  } catch (error) {
    console.error('Error getting helper earnings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get helper transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const helperId = req.userId;
    const { limit = 10, page = 1 } = req.query;
    
    // Check if the user is a helper
    if (req.userType !== 'helper') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Get the helper's transaction history
    const result = await earningsService.getHelperTransactions(
      helperId,
      parseInt(limit),
      parseInt(page)
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error getting helper transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
