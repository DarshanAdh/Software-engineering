#!/bin/bash

# Deployment script for Roadside Relief application

echo "===== Starting deployment process ====="

# Step 1: Install dependencies
echo "Installing frontend dependencies..."
npm install

echo "Installing backend dependencies..."
cd server
npm install
cd ..

echo "Installing Netlify function dependencies..."
cd netlify/functions
npm install
cd ../..

# Step 2: Build the frontend
echo "Building frontend..."
npm run build

# Step 3: Prepare for deployment
echo "Preparing for deployment..."

# Create a .env file for Netlify functions
echo "Creating .env file for Netlify functions..."
cat > netlify/.env << EOL
MONGODB_URI=${MONGODB_URI}
JWT_SECRET=${JWT_SECRET}
NODE_ENV=production
EOL

echo "===== Deployment preparation complete ====="
echo "You can now deploy to Netlify using the Netlify CLI or GitHub integration."
echo "Make sure to set the following environment variables in Netlify:"
echo "- MONGODB_URI: Your MongoDB Atlas connection string"
echo "- JWT_SECRET: A secure random string for JWT token generation"
