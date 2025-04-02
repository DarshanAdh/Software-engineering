
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const helperSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  services: {
    type: [String],
    required: true,
    enum: ['Flat Tire Change', 'Battery Jump-Start', 'Lockout Assistance', 'Fuel Delivery', 'Minor Mechanical Help']
  },
  experience: {
    type: String,
    required: true
  },
  vehicleInfo: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  userType: {
    type: String,
    default: 'helper'
  }
}, {
  timestamps: true
});

// Add geospatial index for location-based queries
helperSchema.index({ location: '2dsphere' });

// Hash password before saving
helperSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
helperSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Helper = mongoose.model('Helper', helperSchema);

module.exports = Helper;
