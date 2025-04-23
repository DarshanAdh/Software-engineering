const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  helperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helper',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  helperEarnings: {
    type: Number,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'inProgress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'manual_entry', 'system'],
    default: 'cash'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Add indexes for faster queries
transactionSchema.index({ helperId: 1, createdAt: -1 });
transactionSchema.index({ customerId: 1, createdAt: -1 });
transactionSchema.index({ requestId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
