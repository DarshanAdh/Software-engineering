#!/bin/bash

# Script to test deployment locally

echo "===== Testing deployment locally ====="

# Step 1: Test MongoDB Atlas connection
echo "Testing MongoDB Atlas connection..."
cd server
node scripts/test-atlas-connection.js
if [ $? -ne 0 ]; then
  echo "MongoDB Atlas connection test failed. Please check your connection string."
  exit 1
fi
cd ..

# Step 2: Test building the frontend
echo "Testing frontend build..."
npm run build
if [ $? -ne 0 ]; then
  echo "Frontend build failed. Please check for errors."
  exit 1
fi

# Step 3: Test Netlify functions locally
echo "Testing Netlify functions locally..."
if ! command -v netlify &> /dev/null; then
  echo "Netlify CLI not found. Installing..."
  npm install -g netlify-cli
fi

echo "Starting Netlify dev server..."
netlify dev --port 8888 &
NETLIFY_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 5

# Test a simple API endpoint
echo "Testing API endpoint..."
curl -s http://localhost:8888/api/auth/validate | grep -q "error\|success"
if [ $? -ne 0 ]; then
  echo "API test failed. Please check your Netlify function configuration."
  kill $NETLIFY_PID
  exit 1
fi

# Kill the Netlify dev server
kill $NETLIFY_PID

echo "===== Deployment test completed successfully! ====="
echo "You can now deploy to Netlify using:"
echo "netlify deploy --prod"
