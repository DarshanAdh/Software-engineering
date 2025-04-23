const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting simple MongoDB connection test...');

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
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
