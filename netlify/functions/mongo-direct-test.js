const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  // Hardcoded connection string for testing (will be removed after testing)
  const uri = 'mongodb+srv://darshan-admin:admin4695456781@cluster0.j8hvx.mongodb.net/roadside-assistance?retryWrites=true&w=majority&appName=Cluster0';
  
  // Log sanitized URI
  const sanitizedURI = uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://*****:*****@');
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
    const dbName = 'roadside-assistance';
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
        collections: collectionNames
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
