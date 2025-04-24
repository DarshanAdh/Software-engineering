#!/bin/bash

# Script to deploy to Netlify using npx

echo "Deploying to Netlify..."

# Build the application
echo "Building the application..."
npm run build

# Deploy to Netlify
echo "Deploying to Netlify..."
npx netlify-cli@12.14.0 deploy --prod

echo "Deployment complete!"
