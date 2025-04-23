console.log('Starting server initialization...');

try {
  console.log('Inside try block...');
  console.log('Loading express...');
  const express = require('express');
  console.log('Loading cors...');
  const cors = require('cors');
  console.log('Loading mongoose...');
  const mongoose = require('mongoose');
  console.log('Loading http...');
  const http = require('http');
  console.log('Loading WebSocket...');
  const WebSocket = require('ws');

  console.log('Modules loaded successfully');

  // Load environment variables
  require('dotenv').config();

  // Log environment variables (hiding sensitive data)
  console.log('Environment variables loaded:');
  console.log('PORT:', process.env.PORT || '5001 (default)');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set (value hidden)' : 'Not set');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set (value hidden)' : 'Not set');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set (development by default)');
  const app = express();

  // MongoDB Connection with proper error handling
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('MONGODB_URI environment variable is not set!');
    process.exit(1);
  }

  // Log the connection string (hiding credentials)
  const sanitizedURI = mongoURI.includes('@')
    ? mongoURI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://*****:*****@')
    : 'mongodb://localhost:*****';
  console.log(`Connecting to MongoDB: ${sanitizedURI}`);

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    retryWrites: true,
    w: 'majority' // Write concern for better reliability
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
  });

  // Handle MongoDB connection errors after initial connection
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
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
app.use(require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/helpers', require('./routes/helpers'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/users', require('./routes/users'));
app.use('/api/earnings', require('./routes/earnings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/db', require('./routes/db-info'));
// ... other routes

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

const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast to all connected clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Start server
console.log(`Attempting to start server on port ${PORT}...`);

try {
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ API available at http://localhost:${PORT}`);
    console.log(`✅ WebSocket server available at ws://localhost:${PORT}/ws`);
    console.log('Server started successfully!');
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Attempt to close server & database gracefully
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.error('Server and MongoDB connection closed due to uncaught exception');
      process.exit(1);
    });
  });
});

} catch (error) {
  console.error('Fatal error during server initialization:', error);
  process.exit(1);
}
