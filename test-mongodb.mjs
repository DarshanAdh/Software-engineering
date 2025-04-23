import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

console.log('Testing MongoDB connection...');

// Get the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  process.exit(1);
}

console.log(`Using URI: ${uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@')}`);

// Connect to MongoDB
try {
  console.log('Attempting to connect to MongoDB...');
  await mongoose.connect(uri);
  console.log('Successfully connected to MongoDB!');
  
  // List all collections in the database
  const collections = await mongoose.connection.db.listCollections().toArray();
  
  console.log('\nAvailable collections:');
  if (collections.length === 0) {
    console.log('No collections found. Your database is empty.');
  } else {
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
  }
  
  // Close the connection
  await mongoose.disconnect();
  console.log('\nConnection closed successfully.');
  
} catch (err) {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
}
