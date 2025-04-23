const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
console.log(`Connecting to MongoDB: ${mongoURI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://*****:*****@')}`);

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});
