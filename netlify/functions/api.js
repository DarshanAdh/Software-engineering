const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('../../server/routes/auth');
const helpersRoutes = require('../../server/routes/helpers');
const requestsRoutes = require('../../server/routes/requests');
const usersRoutes = require('../../server/routes/users');
const earningsRoutes = require('../../server/routes/earnings');
const adminRoutes = require('../../server/routes/admin');
const dbInfoRoutes = require('../../server/routes/db-info');

const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

// Log the connection string (hiding credentials)
const sanitizedURI = mongoURI && mongoURI.includes('@')
  ? mongoURI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://*****:*****@')
  : 'mongodb://localhost:*****';
console.log(`Netlify Function - Connecting to MongoDB: ${sanitizedURI}`);

// Check if MongoDB URI is set
if (!mongoURI) {
  console.error('MONGODB_URI environment variable is not set');
}

// Connect with better error handling
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
})
.then(() => {
  console.log('Netlify Function - Connected to MongoDB successfully');
})
.catch(err => {
  console.error('Netlify Function - MongoDB connection error:', err);
  // Don't exit the process in serverless function
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://roadside-relief.netlify.app',
  'https://roadside-caretakers.netlify.app',
  'https://roadside-assistance.netlify.app',
  'https://roadside-assistance-app.netlify.app',
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const mongoStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[mongoStatus];

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: {
      status: mongoStatusText,
      readyState: mongoStatus
    },
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/helpers', helpersRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/db', dbInfoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Netlify Function - Error:', err.message);
  console.error('Netlify Function - Stack:', err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or no token provided'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    console.error('Netlify Function - MongoDB Error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Database error occurred',
      error: err.message
    });
  }

  // Always return detailed error information in Netlify Functions for debugging
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    stack: err.stack,
    name: err.name
  });
});

// Export the serverless function
module.exports.handler = serverless(app);
