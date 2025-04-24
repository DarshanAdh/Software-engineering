#!/bin/bash

# Script to copy environment variables to Netlify functions

echo "Copying environment variables to Netlify functions..."

# Source .env file
SOURCE_ENV=".env.netlify"

# Destination .env file in Netlify functions directory
DEST_ENV="netlify/functions/.env"

# Check if source file exists
if [ ! -f "$SOURCE_ENV" ]; then
  echo "Source .env file not found: $SOURCE_ENV"
  exit 1
fi

# Create the destination directory if it doesn't exist
mkdir -p "netlify/functions"

# Copy the file
cp "$SOURCE_ENV" "$DEST_ENV"

if [ $? -eq 0 ]; then
  echo "Environment variables copied successfully to: $DEST_ENV"
else
  echo "Error copying environment variables"
  exit 1
fi
