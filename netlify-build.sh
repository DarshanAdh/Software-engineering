#!/bin/bash

# Build script for Netlify deployment

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend
echo "Building frontend..."
npm run build

echo "Build completed successfully!"
