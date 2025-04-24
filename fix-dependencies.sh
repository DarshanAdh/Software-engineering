#!/bin/bash

# Script to fix dependencies for local development

echo "Fixing dependencies for local development..."

# Step 1: Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Step 2: Remove node_modules directories
echo "Removing node_modules directories..."
rm -rf node_modules
rm -rf server/node_modules

# Step 3: Install client-side dependencies
echo "Installing client-side dependencies..."
npm install

# Step 4: Install server-side dependencies
echo "Installing server-side dependencies..."
cd server
npm install
cd ..

echo "Dependencies fixed! You can now run the application with 'npm start'"
