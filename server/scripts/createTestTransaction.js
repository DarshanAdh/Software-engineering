const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Helper = require('../models/Helper');
const User = require('../models/User');
const Request = require('../models/Request');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/roadside-relief')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const createTestTransaction = async () => {
  try {
    // Find a helper
    const helper = await Helper.findOne();
    if (!helper) {
      console.error('No helper found');
      process.exit(1);
    }

    // Find a user
    const user = await User.findOne({ userType: 'customer' });
    if (!user) {
      console.error('No customer found');
      process.exit(1);
    }

    // Find or create a request
    let request = await Request.findOne({ status: 'completed' });

    if (!request) {
      console.log('No completed request found, creating one...');

      request = new Request({
        user: user._id,
        helper: helper._id,
        serviceType: 'tire',
        description: 'Test request',
        location: {
          type: 'Point',
          coordinates: [0, 0],
          address: 'Test address'
        },
        status: 'completed',
        estimatedPrice: 100,
        isUrgent: false,
        vehicle: 'Test vehicle',
        createdAt: new Date(),
        completedAt: new Date()
      });

      await request.save();
      console.log('Created test request');
    }

    // Create a transaction
    const serviceFee = request.estimatedPrice * 0.15;
    const helperEarnings = request.estimatedPrice - serviceFee;

    const transaction = new Transaction({
      requestId: request._id,
      helperId: helper._id,
      customerId: user._id,
      amount: request.estimatedPrice,
      serviceFee,
      helperEarnings,
      serviceType: request.serviceType,
      status: 'completed',
      paymentMethod: 'cash',
      completedAt: new Date()
    });

    await transaction.save();
    console.log('Created test transaction');
    console.log('Transaction details:', {
      amount: transaction.amount,
      serviceFee: transaction.serviceFee,
      helperEarnings: transaction.helperEarnings,
      helperId: transaction.helperId
    });

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating test transaction:', error);
    process.exit(1);
  }
};

createTestTransaction();
