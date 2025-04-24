#!/bin/bash

# Main deployment script for Roadside Assistance application

echo "===== Roadside Assistance Deployment ====="
echo "This script will help you deploy the application to Netlify (frontend) and Heroku (backend)."
echo

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
MISSING_PREREQS=false

if ! command_exists node; then
  echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
  MISSING_PREREQS=true
fi

if ! command_exists npm; then
  echo "❌ npm is not installed. It should come with Node.js."
  MISSING_PREREQS=true
fi

if ! command_exists git; then
  echo "❌ git is not installed. Please install it from https://git-scm.com/"
  MISSING_PREREQS=true
fi

if [ "$MISSING_PREREQS" = true ]; then
  echo "Please install the missing prerequisites and try again."
  exit 1
fi

echo "✅ All basic prerequisites are installed."
echo

# Ask what to deploy
echo "What would you like to deploy?"
echo "1) Frontend (Netlify)"
echo "2) Backend (Heroku)"
echo "3) Both"
read -p "Enter your choice (1-3): " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
  1)
    echo "Deploying frontend to Netlify..."
    cd client
    npm run build
    npx netlify-cli deploy --prod
    ;;
  2)
    echo "Deploying backend to Heroku..."
    if ! command_exists heroku; then
      echo "❌ Heroku CLI is not installed. Please install it first:"
      echo "https://devcenter.heroku.com/articles/heroku-cli"
      exit 1
    fi

    cd server

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

    # Deploy to Heroku
    git init
    git add .
    git commit -m "Deploy to Heroku"
    git push heroku master --force
    ;;
  3)
    echo "Deploying backend to Heroku first..."
    if ! command_exists heroku; then
      echo "❌ Heroku CLI is not installed. Please install it first:"
      echo "https://devcenter.heroku.com/articles/heroku-cli"
      exit 1
    fi

    cd server

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

    # Deploy to Heroku
    git init
    git add .
    git commit -m "Deploy to Heroku"
    git push heroku master --force

    cd ..

    echo "Now deploying frontend to Netlify..."
    cd client
    npm run build
    npx netlify-cli deploy --prod
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo
echo "===== Deployment Complete ====="
echo
echo "Don't forget to update your environment variables!"
echo "- In Netlify: Set VITE_API_URL to your Heroku app URL"
echo "- In Heroku: Make sure MONGODB_URI, JWT_SECRET, and NODE_ENV are set"
echo
echo "Thank you for using the Roadside Assistance deployment script!"
