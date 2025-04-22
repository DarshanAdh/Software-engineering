const mongoose = require('mongoose');
require('dotenv').config();

// Simple handler function
exports.handler = async function(event, context) {
  // Log environment variables (sanitized)
  console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);
  console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
  
  // Return basic information
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Test function is working',
      env: {
        MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set',
        NODE_ENV: process.env.NODE_ENV || 'not set'
      },
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        headers: event.headers
      }
    })
  };
};
