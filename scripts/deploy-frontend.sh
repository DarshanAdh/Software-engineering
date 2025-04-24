#!/bin/bash

# Script to deploy the frontend to Netlify

echo "Preparing frontend for Netlify deployment..."

# Navigate to client directory
cd client || exit

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the frontend..."
npm run build

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
echo "You'll need to authenticate with Netlify if you haven't already."
netlify deploy --prod

echo "Frontend deployment complete!"
echo "Visit your Netlify dashboard to see your deployed site."
