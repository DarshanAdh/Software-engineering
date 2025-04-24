#!/bin/bash

# Script to test the build process locally

echo "===== Testing build process locally ====="

# Make sure the build script is executable
chmod +x netlify-build.sh

# Run the build script
./netlify-build.sh

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful!"
  echo "The dist directory should contain the built frontend files."
  echo "The netlify/functions directory should contain the backend functions."
else
  echo "Build failed. Please check the error messages above."
  exit 1
fi

echo "===== Build test completed ====="
