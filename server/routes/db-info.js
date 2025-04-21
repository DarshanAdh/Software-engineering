const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Route to get database information
router.get('/info', async (req, res) => {
  try {
    // Get the current database name
    const dbName = mongoose.connection.db.databaseName;
    
    // Get list of collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    res.json({
      connected: mongoose.connection.readyState === 1,
      database: dbName,
      collections: collectionNames,
      connectionInfo: {
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        user: mongoose.connection.user || 'Not specified'
      }
    });
  } catch (error) {
    console.error('Error getting database info:', error);
    res.status(500).json({ 
      error: 'Failed to get database information',
      message: error.message
    });
  }
});

module.exports = router;
