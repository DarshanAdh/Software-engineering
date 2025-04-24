#!/bin/bash

echo "Cleaning up node_modules..."
rm -rf node_modules
rm -rf server/node_modules

echo "Cleaning up package-lock.json..."
rm -f package-lock.json
rm -f server/package-lock.json

echo "Cleaning up .vite cache..."
rm -rf node_modules/.vite

echo "Installing root dependencies..."
npm install

echo "Installing server dependencies..."
cd server && npm install

echo "Starting the application..."
cd .. && npm start
