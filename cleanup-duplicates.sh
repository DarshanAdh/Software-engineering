#!/bin/bash

# Script to clean up duplicate files after separating frontend and backend

echo "Cleaning up duplicate files after frontend/backend separation..."

# Remove frontend files from root directory (now in client/)
echo "Removing frontend files from root directory..."

# Source code
rm -rf src

# Configuration files
rm -f index.html
rm -f vite.config.ts
rm -f tsconfig.json
rm -f tsconfig.app.json
rm -f tsconfig.node.json
rm -f postcss.config.js
rm -f tailwind.config.ts
rm -f components.json
rm -f eslint.config.js
rm -f .env.development
rm -f .env.production

# Public directory
rm -rf public

# Remove any other unnecessary files
echo "Removing other unnecessary files..."
rm -f roadside-frontend

echo "Cleanup complete!"
echo "Frontend files are now in the 'client' directory."
echo "Backend files are in the 'server' directory."
