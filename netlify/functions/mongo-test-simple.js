const { MongoClient } = require('mongodb');
require('dotenv').config();

exports.handler = async function(event, context) {
  // Get MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI;
  
  // Log sanitized URI
  const sanitizedURI = uri && uri.includes('@')
    ? uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://*****:*****@')
    : 'mongodb://localhost:*****';
  console.log(`Connecting to MongoDB: ${sanitizedURI}`);
  
  // Create MongoDB client
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database info
    const dbName = uri.split('/').pop().split('?')[0];
    const db = client.db(dbName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Close connection
    await client.close();
    console.log('Disconnected from MongoDB');
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'MongoDB connection test successful',
        database: dbName,
        collections: collectionNames,
        env: {
          NODE_ENV: process.env.NODE_ENV || 'not set',
          MONGODB_URI: uri ? 'set' : 'not set',
          JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set'
        }
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
        stack: error.stack,
        env: {
          NODE_ENV: process.env.NODE_ENV || 'not set',
          MONGODB_URI: uri ? 'set' : 'not set',
          JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set'
        }
      })
    };
  }
};
