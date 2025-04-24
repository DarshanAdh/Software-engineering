#!/bin/bash

# Script to deploy the backend to Heroku

echo "Preparing backend for Heroku deployment..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI not found. Please install it first:"
    echo "https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Navigate to server directory
cd server || exit

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "You need to login to Heroku first"
    heroku login
fi

# Check if app exists or create a new one
APP_NAME="roadside-assistance-api"
if ! heroku apps:info "$APP_NAME" &> /dev/null; then
    echo "Creating Heroku app: $APP_NAME"
    heroku create "$APP_NAME"
else
    echo "Using existing Heroku app: $APP_NAME"
fi

# Set environment variables on Heroku
echo "Setting up environment variables..."
# Read from .env file and set on Heroku
if [ -f .env ]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip comments and empty lines
        [[ "$line" =~ ^#.*$ ]] && continue
        [[ -z "$line" ]] && continue
        
        # Extract variable name and value
        var_name=$(echo "$line" | cut -d '=' -f 1)
        var_value=$(echo "$line" | cut -d '=' -f 2-)
        
        # Set on Heroku
        echo "Setting $var_name"
        heroku config:set "$var_name=$var_value" --app "$APP_NAME"
    done < .env
else
    echo "No .env file found. Please set environment variables manually in Heroku dashboard."
    echo "Required variables: MONGODB_URI, JWT_SECRET, NODE_ENV=production"
fi

# Deploy to Heroku
echo "Deploying to Heroku..."
git init
git add .
git commit -m "Deploy to Heroku"
git push heroku master --force

echo "Backend deployment complete!"
echo "Your API is now available at: https://$APP_NAME.herokuapp.com"

# Return to the root directory
cd ..

echo "Don't forget to update your frontend's API URL to point to your Heroku app!"
echo "In your Netlify environment variables, set VITE_API_URL=https://$APP_NAME.herokuapp.com"
