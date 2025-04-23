# MongoDB Atlas Setup Guide for Roadside Assistance App

This guide will help you set up MongoDB Atlas for the Roadside Assistance application.

## Prerequisites
- A MongoDB Atlas account (free tier is sufficient)
- Node.js and npm installed
- Git repository cloned locally

## Step 1: Create a MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Start Free"
3. Sign up with your email, or use Google/GitHub authentication

## Step 2: Create a New Cluster
1. After signing in, you'll be prompted to create a new cluster
2. Choose the "FREE" tier (M0 Sandbox)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your users for better performance
5. Click "Create Cluster" (this may take a few minutes to provision)

## Step 3: Set Up Database Access
1. While your cluster is being created, go to the "Database Access" section in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (make sure to save these credentials)
4. Set privileges to "Read and Write to Any Database"
5. Click "Add User"

## Step 4: Configure Network Access
1. Go to the "Network Access" section in the left sidebar
2. Click "Add IP Address"
3. For development, you can allow access from anywhere by clicking "Allow Access from Anywhere"
   (Note: For production, add specific IP addresses that should have access)
4. Click "Confirm"

## Step 5: Get Your Connection String
1. Once your cluster is created, click "Connect" on your cluster
2. Select "Connect your application"
3. Choose "Node.js" as your driver and the appropriate version
4. Copy the connection string provided

## Step 6: Update Your Application's Environment Variables
1. In the project root, locate the `server/.env` file
2. Update the `MONGODB_URI` variable with your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/roadside-relief?retryWrites=true&w=majority
   ```
3. Replace `<username>` and `<password>` with the credentials you created in Step 3

## Step 7: Test the Connection
1. Run the test connection script:
   ```
   cd server
   node scripts/test-atlas-connection.js
   ```
2. If successful, you should see "Successfully connected to MongoDB Atlas!" and a list of available collections

## Step 8: Migrating Existing Data (Optional)
If you have existing data in a local MongoDB instance that you want to migrate:

1. Export data from your local MongoDB:
   ```
   mongodump --uri="mongodb://localhost:27017/roadside-relief" --out=./dump
   ```

2. Import data to MongoDB Atlas:
   ```
   mongorestore --uri="mongodb+srv://<username>:<password>@cluster0.mongodb.net/roadside-relief" --drop ./dump/roadside-relief
   ```

## Step 9: Update Your Application Code
The application should now be configured to use MongoDB Atlas. Start your application as usual:

```
npm start
```

## Troubleshooting
- If you encounter connection issues, check your network settings and ensure your IP is allowed in the Network Access settings
- Verify that your username and password are correct in the connection string
- Make sure you've replaced the placeholders in the connection string with your actual credentials
- Check that your MongoDB Atlas cluster is up and running

## Additional Resources
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)
- [MongoDB Database Tools Documentation](https://docs.mongodb.com/database-tools/)
