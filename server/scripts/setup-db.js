/**
 * MongoDB Setup Script for Roadside Relief
 * 
 * This script sets up the MongoDB database with collections, indexes,
 * and sample data for the Roadside Relief application.
 * 
 * Usage:
 * 1. Make sure MongoDB is running
 * 2. Run this script with Node.js:
 *    node setup-db.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connection URL
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/roadside-relief';
const client = new MongoClient(uri);

async function setupDatabase() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Get database reference
    const db = client.db();
    
    // Create collections if they don't exist
    console.log('Creating collections...');
    try {
      await db.createCollection('users');
      await db.createCollection('helpers');
      await db.createCollection('requests');
      console.log('Collections created successfully');
    } catch (err) {
      console.log('Collections already exist');
    }

    // Create indexes
    console.log('Creating indexes...');
    await db.collection('users').createIndex({ "email": 1 }, { unique: true });
    await db.collection('helpers').createIndex({ "email": 1 }, { unique: true });
    await db.collection('helpers').createIndex({ "location": "2dsphere" });
    await db.collection('requests').createIndex({ "location": "2dsphere" });
    await db.collection('requests').createIndex({ "user": 1 });
    await db.collection('requests').createIndex({ "helper": 1 });
    await db.collection('requests').createIndex({ "status": 1 });
    console.log('Indexes created successfully');

    // Check if sample data already exists
    const customerExists = await db.collection('users').findOne({ email: 'cr7@example.com' });
    const helperExists = await db.collection('helpers').findOne({ email: 'speed@example.com' });

    if (customerExists || helperExists) {
      console.log('Sample data already exists. Skipping sample data creation.');
      return;
    }

    // Create sample data
    console.log('Creating sample data...');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const customerPassword = await bcrypt.hash('Ronaldo@123', salt);
    const helperPassword = await bcrypt.hash('Speed@123', salt);

    // Insert customer: Cristiano Ronaldo
    const customerResult = await db.collection('users').insertOne({
      fullName: "Cristiano Ronaldo",
      email: "cr7@example.com",
      phone: "1234567890",
      password: customerPassword,
      driverLicense: "CR7-12345",
      licensePlate: "GOAT-7",
      userType: "customer",
      createdAt: new Date()
    });
    console.log('Customer created with ID:', customerResult.insertedId);

    // Insert helper: IShowSpeed
    const helperResult = await db.collection('helpers').insertOne({
      fullName: "IShowSpeed",
      email: "speed@example.com",
      phone: "9876543210",
      password: helperPassword,
      services: ["Flat Tire Change", "Battery Jump-Start", "Fuel Delivery"],
      experience: "5 years of experience helping stranded drivers. Specialized in tire changes and battery services.",
      vehicleInfo: "Ford F-150 Truck (2020), Red",
      isAvailable: true,
      isVerified: true,
      location: {
        type: "Point",
        coordinates: [-73.9857, 40.7484] // New York City coordinates
      },
      rating: 4.8,
      totalRatings: 156,
      userType: "helper"
    });
    console.log('Helper created with ID:', helperResult.insertedId);

    // Insert sample request
    const requestResult = await db.collection('requests').insertOne({
      user: customerResult.insertedId,
      serviceType: "tire",
      description: "Flat tire on my Ferrari. Need urgent assistance.",
      location: {
        type: "Point",
        coordinates: [-73.9837, 40.7494], // Near Times Square
        address: "Times Square, New York, NY"
      },
      status: "accepted",
      helper: helperResult.insertedId,
      estimatedPrice: 120,
      isUrgent: true,
      vehicle: "Ferrari 458 (Red)",
      createdAt: new Date(),
      acceptedAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
    });
    console.log('Request created with ID:', requestResult.insertedId);

    console.log('Sample data created successfully');
    console.log('\nYou can now log in with the following credentials:');
    console.log('Customer:');
    console.log('  Email: cr7@example.com');
    console.log('  Password: Ronaldo@123');
    console.log('Helper:');
    console.log('  Email: speed@example.com');
    console.log('  Password: Speed@123');

  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Disconnected from MongoDB server');
  }
}

// Run the setup function
setupDatabase().catch(console.error);
