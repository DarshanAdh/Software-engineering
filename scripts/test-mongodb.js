const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');

// Get the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  process.exit(1);
}

console.log(`Using URI: ${uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@')}`);

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    
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
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
