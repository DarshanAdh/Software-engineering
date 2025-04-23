/**
 * Script to create a sample admin user
 * 
 * This script creates an admin user with specified credentials
 * in the MongoDB database.
 * 
 * Usage:
 * 1. Make sure MongoDB connection is configured in .env
 * 2. Run: node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Admin model schema
const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  },
  permissions: {
    approveHelpers: {
      type: Boolean,
      default: true
    },
    manageUsers: {
      type: Boolean,
      default: true
    },
    viewTransactions: {
      type: Boolean,
      default: true
    }
  },
  userType: {
    type: String,
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin1234@roadside.com' });
    if (existingAdmin) {
      console.log('Admin user already exists with this email');
      await mongoose.connection.close();
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345', salt);

    // Create the admin user
    const admin = new Admin({
      fullName: 'admin1234',
      email: 'admin1234@roadside.com',
      phone: '1234567890',
      password: hashedPassword,
      role: 'admin',
      userType: 'admin',
      permissions: {
        approveHelpers: true,
        manageUsers: true,
        viewTransactions: true
      }
    });

    // Save the admin user
    await admin.save();
    console.log('Admin user created successfully');
    console.log('----------------------------------');
    console.log('Admin Login Credentials:');
    console.log('Email: admin1234@roadside.com');
    console.log('Password: 12345');
    console.log('----------------------------------');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
createAdmin();
