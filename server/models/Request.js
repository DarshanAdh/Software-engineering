const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['tire', 'battery', 'lockout', 'fuel', 'other', 'tow']
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'inProgress', 'completed', 'cancelled'],
    default: 'pending'
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Helper'
  },
  estimatedPrice: {
    type: Number,
    required: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  vehicle: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date
});

// Add index for geospatial queries
requestSchema.index({ 'location': '2dsphere' });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
