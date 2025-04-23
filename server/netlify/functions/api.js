// Serverless function for Netlify
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Log environment variables (hiding sensitive data)
console.log('Environment variables loaded in serverless function:');
console.log('PORT:', process.env.PORT || '5001 (default)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (value hidden)' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (value hidden)' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set (development by default)');

const app = express();

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MONGODB_URI environment variable is not set!');
  // In serverless context, we can't exit the process
  // Instead, we'll continue but the app won't work correctly
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('Connected to MongoDB successfully in serverless function'))
.catch(err => {
  console.error('MongoDB connection error in serverless function:', err);
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(require('helmet')());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/.netlify/functions/api/auth', require('../../routes/auth'));
app.use('/.netlify/functions/api/helpers', require('../../routes/helpers'));
app.use('/.netlify/functions/api/requests', require('../../routes/requests'));
app.use('/.netlify/functions/api/users', require('../../routes/users'));
app.use('/.netlify/functions/api/earnings', require('../../routes/earnings'));
app.use('/.netlify/functions/api/admin', require('../../routes/admin'));
app.use('/.netlify/functions/api/db', require('../../routes/db-info'));

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Roadside Assistance API is running in serverless mode' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

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

  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Export the serverless handler
module.exports.handler = serverless(app);
