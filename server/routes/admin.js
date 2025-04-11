const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Helper = require('../models/Helper');
const Request = require('../models/Request');
const Transaction = require('../models/Transaction');

// Get all users (customers and helpers)
router.get('/users', adminAuth, async (req, res) => {
  try {
    // Get customers
    const customers = await User.find({ userType: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
      
    // Get helpers
    const helpers = await Helper.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    // Format the response
    const formattedCustomers = customers.map(customer => ({
      id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      userType: 'customer',
      createdAt: customer.createdAt
    }));
    
    const formattedHelpers = helpers.map(helper => ({
      id: helper._id,
      fullName: helper.fullName,
      email: helper.email,
      phone: helper.phone,
      userType: 'helper',
      isApproved: helper.isVerified,
      createdAt: helper.createdAt
    }));
    
    // Combine and send
    const allUsers = [...formattedCustomers, ...formattedHelpers];
    
    res.json({ users: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get pending helpers
router.get('/helpers/pending', adminAuth, async (req, res) => {
  try {
    const pendingHelpers = await Helper.find({ isVerified: false })
      .select('-password')
      .sort({ createdAt: -1 });
    
    const formattedHelpers = pendingHelpers.map(helper => ({
      id: helper._id,
      fullName: helper.fullName,
      email: helper.email,
      phone: helper.phone,
      services: helper.services,
      experience: helper.experience,
      vehicleInfo: helper.vehicleInfo,
      createdAt: helper.createdAt
    }));
    
    res.json({ helpers: formattedHelpers });
  } catch (error) {
    console.error('Error fetching pending helpers:', error);
    res.status(500).json({ message: 'Error fetching pending helpers', error: error.message });
  }
});

// Approve helper
router.put('/helpers/approve/:id', adminAuth, async (req, res) => {
  try {
    const helper = await Helper.findById(req.params.id);
    
    if (!helper) {
      return res.status(404).json({ message: 'Helper not found' });
    }
    
    helper.isVerified = true;
    await helper.save();
    
    res.json({ 
      message: 'Helper approved successfully',
      helper: {
        id: helper._id,
        fullName: helper.fullName,
        email: helper.email,
        isApproved: helper.isVerified
      }
    });
  } catch (error) {
    console.error('Error approving helper:', error);
    res.status(500).json({ message: 'Error approving helper', error: error.message });
  }
});

// Delete user (customer or helper)
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    // Try to find and delete from User collection
    let user = await User.findByIdAndDelete(req.params.id);
    
    // If not found in User collection, try Helper collection
    if (!user) {
      user = await Helper.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Get all transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate('customerId', 'fullName')
      .populate('helperId', 'fullName');
    
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      amount: transaction.amount,
      status: transaction.status,
      createdAt: transaction.createdAt,
      userId: transaction.customerId._id,
      userName: transaction.customerId.fullName,
      helperName: transaction.helperId ? transaction.helperId.fullName : 'N/A',
      userType: 'customer',
      description: `Payment for ${transaction.serviceType} service`
    }));
    
    res.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Get user history (requests for customer, services for helper)
router.get('/users/:id/history', adminAuth, async (req, res) => {
  try {
    // First, determine if the ID is for a customer or helper
    let userType = 'customer';
    let user = await User.findById(req.params.id);
    
    if (!user) {
      user = await Helper.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      userType = 'helper';
    }
    
    let history = [];
    
    if (userType === 'customer') {
      // Get requests made by this customer
      const requests = await Request.find({ user: req.params.id })
        .sort({ createdAt: -1 })
        .populate('helper', 'fullName');
      
      history = requests.map(request => ({
        id: request._id,
        status: request.status,
        location: request.location.address,
        serviceType: request.serviceType,
        createdAt: request.createdAt,
        customerId: request.user,
        customerName: user.fullName,
        helperId: request.helper ? request.helper._id : null,
        helperName: request.helper ? request.helper.fullName : 'Not assigned'
      }));
    } else {
      // Get requests serviced by this helper
      const requests = await Request.find({ helper: req.params.id })
        .sort({ createdAt: -1 })
        .populate('user', 'fullName');
      
      history = requests.map(request => ({
        id: request._id,
        status: request.status,
        location: request.location.address,
        serviceType: request.serviceType,
        createdAt: request.createdAt,
        customerId: request.user._id,
        customerName: request.user.fullName,
        helperId: req.params.id,
        helperName: user.fullName
      }));
    }
    
    res.json({ history });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ message: 'Error fetching user history', error: error.message });
  }
});

module.exports = router;
