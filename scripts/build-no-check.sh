#!/bin/bash

# Script to build the project without TypeScript type checking

echo "===== Starting build process (no type checking) ====="

# Install main dependencies
echo "Installing dependencies..."
npm install

# Install function dependencies
echo "Installing function dependencies..."
cd netlify/functions
npm install
cd ../..

# Copy environment variables to Netlify functions
echo "Copying environment variables..."
./copy-env.sh

# Build the frontend with improved error handling
echo "Building frontend..."
set -e  # Exit immediately if a command exits with a non-zero status

# Run Vite build directly (it will handle TypeScript transpilation without type checking)
echo "Running Vite build..."
NODE_ENV=production VITE_SKIP_TS_CHECK=true npx vite build --mode production

echo "===== Build process completed ====="
