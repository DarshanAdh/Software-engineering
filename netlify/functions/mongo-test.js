const mongoose = require('mongoose');
require('dotenv').config();

exports.handler = async function(event, context) {
  // Log the MongoDB URI (sanitized)
  const mongoURI = process.env.MONGODB_URI;
  const sanitizedURI = mongoURI && mongoURI.includes('@')
    ? mongoURI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://*****:*****@')
    : 'mongodb://localhost:*****';
  console.log(`Connecting to MongoDB: ${sanitizedURI}`);
  
  try {
    // Try to connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    
    console.log('Connected to MongoDB successfully');
    
    // Get connection status
    const mongoStatus = mongoose.connection.readyState;
    const mongoStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[mongoStatus];
    
    // Get database information
    const dbInfo = {
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
    };
    
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'MongoDB connection test successful',
        status: mongoStatusText,
        dbInfo: dbInfo
      })
    };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'MongoDB connection test failed',
        error: error.message,
        stack: error.stack
      })
    };
  }
};
