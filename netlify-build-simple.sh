#!/bin/bash

# Simple build script for Netlify that ensures TypeScript is installed

echo "===== Starting Netlify build process ====="

# Install dependencies including TypeScript
echo "Installing dependencies..."
npm install
npm install typescript --no-save

# Install function dependencies
echo "Installing function dependencies..."
cd netlify/functions
npm install
cd ../..

# Copy environment variables to Netlify functions
echo "Copying environment variables..."
if [ -f ".env.netlify" ]; then
  cp .env.netlify netlify/functions/.env
  echo "Environment variables copied successfully"
else
  echo "No .env.netlify file found, skipping environment variable copy"
fi

# Build the frontend with TypeScript
echo "Building frontend..."
set -e  # Exit immediately if a command exits with a non-zero status

# Run TypeScript compiler with skip lib check
echo "Running TypeScript compiler..."
npx tsc --skipLibCheck

# Run Vite build
echo "Running Vite build..."
npx vite build

echo "===== Build process completed ====="
