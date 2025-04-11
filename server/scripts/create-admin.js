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

// Import User model
const User = require('../models/User');

// Admin user data
const adminData = {
  fullName: 'System Administrator',
  email: 'admin123@gmail.com',
  phone: '1234567890',
  password: 'admin123',
  userType: 'admin',
  // These fields are required by the schema but not used for admin
  driverLicense: 'ADMIN00000',
  licensePlate: 'ADMIN'
};

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists with this email.');
      process.exit(0);
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);
    
    // Create the admin user
    const admin = new User({
      ...adminData,
      password: hashedPassword
    });
    
    await admin.save();
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('User Type: Admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Run the function
createAdmin();
