/**
 * Script to test MongoDB Atlas connection
 * 
 * Run with: node scripts/test-atlas-connection.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Get the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB Atlas...');
console.log(`Using URI: ${uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@')}`);

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    
    // List all collections in the database
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('\nAvailable collections:');
    if (collections.length === 0) {
      console.log('No collections found. Your database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close the connection
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('\nConnection closed successfully.');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
  });
