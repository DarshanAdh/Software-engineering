const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const moment = require('moment');

const earningsService = {
  // Calculate earnings for a helper
  getHelperEarnings: async (helperId) => {
    try {
      // Get current date information
      const today = moment().startOf('day');
      const weekStart = moment().startOf('week');
      const monthStart = moment().startOf('month');

      // Get total earnings (all time)
      const totalEarnings = await Transaction.aggregate([
        {
          $match: {
            helperId: new mongoose.Types.ObjectId(helperId),
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$helperEarnings' }
          }
        }
      ]);

      // Get today's earnings
      const todayEarnings = await Transaction.aggregate([
        {
          $match: {
            helperId: new mongoose.Types.ObjectId(helperId),
            status: 'completed',
            completedAt: { $gte: today.toDate() }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$helperEarnings' }
          }
        }
      ]);

      // Get this week's earnings
      const weekEarnings = await Transaction.aggregate([
        {
          $match: {
            helperId: new mongoose.Types.ObjectId(helperId),
            status: 'completed',
            completedAt: { $gte: weekStart.toDate() }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$helperEarnings' }
          }
        }
      ]);

      // Get this month's earnings
      const monthEarnings = await Transaction.aggregate([
        {
          $match: {
            helperId: new mongoose.Types.ObjectId(helperId),
            status: 'completed',
            completedAt: { $gte: monthStart.toDate() }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$helperEarnings' }
          }
        }
      ]);

      return {
        today: todayEarnings.length > 0 ? todayEarnings[0].total : 0,
        week: weekEarnings.length > 0 ? weekEarnings[0].total : 0,
        month: monthEarnings.length > 0 ? monthEarnings[0].total : 0,
        total: totalEarnings.length > 0 ? totalEarnings[0].total : 0
      };
    } catch (error) {
      console.error('Error calculating helper earnings:', error);
      throw error;
    }
  },

  // Create or update a transaction for a request
  recordTransaction: async (requestId, status) => {
    try {
      // Get the request details with populated user and helper
      const Request = require('../models/Request');
      const request = await Request.findById(requestId)
        .populate('user')
        .populate('helper');

      if (!request) {
        throw new Error('Request not found');
      }

      if (!request.helper) {
        throw new Error('Request has no assigned helper');
      }

      // Calculate service fee (e.g., 15% of the total amount)
      const serviceFee = request.estimatedPrice * 0.15;
      const helperEarnings = request.estimatedPrice - serviceFee;

      // Check if a transaction already exists for this request
      let transaction = await Transaction.findOne({ requestId: request._id });

      if (transaction) {
        // Update existing transaction
        transaction.status = status;

        // If the request is completed, update the completedAt date
        if (status === 'completed') {
          transaction.completedAt = new Date();
        }

        await transaction.save();
        console.log(`Transaction updated to ${status} status`);
      } else {
        // Create a new transaction
        transaction = new Transaction({
          requestId: request._id,
          helperId: request.helper._id,
          customerId: request.user._id,
          amount: request.estimatedPrice,
          serviceFee,
          helperEarnings,
          serviceType: request.serviceType,
          status: status === 'completed' ? 'completed' : 'pending',
          paymentMethod: 'cash', // Default to cash for now
          createdAt: new Date()
        });

        // If the request is completed, set the completedAt date
        if (status === 'completed') {
          transaction.completedAt = new Date();
        }

        await transaction.save();
        console.log(`New transaction created with ${status} status`);
      }

      return transaction;
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  },

  // Get transaction history for a helper
  getHelperTransactions: async (helperId, limit = 10, page = 1) => {
    try {
      const skip = (page - 1) * limit;

      const transactions = await Transaction.find({ helperId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'requestId',
          select: 'serviceType location vehicle createdAt'
        })
        .populate({
          path: 'customerId',
          select: 'fullName'
        });

      const total = await Transaction.countDocuments({ helperId });

      return {
        transactions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting helper transactions:', error);
      throw error;
    }
  }
};

module.exports = earningsService;
