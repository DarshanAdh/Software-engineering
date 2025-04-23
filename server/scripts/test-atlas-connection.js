/**
 * Script to test MongoDB Atlas connection
 *
 * Run with: node scripts/test-atlas-connection.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Get the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  console.log('Please set the MONGODB_URI environment variable to your MongoDB Atlas connection string.');
  console.log('Example: export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/roadside-relief"');
  process.exit(1);
}

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
      console.log('\nYou may want to run the database setup script:');
      console.log('npm run setup-db');
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

    if (err.name === 'MongoServerSelectionError') {
      console.log('\nPossible causes:');
      console.log('1. Network access is not configured correctly in MongoDB Atlas');
      console.log('2. Username or password in the connection string is incorrect');
      console.log('3. Cluster name or database name is incorrect');

      console.log('\nTroubleshooting steps:');
      console.log('1. Check that you\'ve allowed access from anywhere (0.0.0.0/0) in MongoDB Atlas Network Access');
      console.log('2. Verify your username and password');
      console.log('3. Check that the cluster name in your connection string is correct');
    }

    process.exit(1);
  });
