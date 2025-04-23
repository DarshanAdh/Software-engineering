
#!/bin/bash
echo "===== Starting build process ====="

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

# Skip TypeScript type checking for build
echo "Skipping TypeScript type checking..."

# Run Vite build directly (it will handle TypeScript transpilation without type checking)
echo "Running Vite build..."
NODE_ENV=production ./node_modules/.bin/vite build --mode production

echo "===== Build process completed ====="
