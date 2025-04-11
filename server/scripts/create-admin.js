/**
 * Script to create an admin user in the database
 *
 * Run with: node create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roadside-relief')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import Admin model
const Admin = require('../models/Admin');

// Admin user data
const adminData = {
  fullName: 'System Administrator',
  email: 'admin123@gmail.com',
  phone: '1234567890',
  password: 'admin123',
  role: 'superadmin',
  permissions: {
    approveHelpers: true,
    manageUsers: true,
    viewTransactions: true
  }
};

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('Admin user already exists with this email.');
      process.exit(0);
    }

    // Create the admin user (password will be hashed by the pre-save middleware)
    const admin = new Admin(adminData);

    await admin.save();

    console.log('Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Role: ' + adminData.role);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run the function
createAdmin();
