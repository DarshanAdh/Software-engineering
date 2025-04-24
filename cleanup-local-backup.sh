#!/bin/bash

# Script to remove all Netlify and deployment-related files
# for a clean local development backup

echo "Removing Netlify and deployment-related files..."

# Remove Netlify configuration files
rm -f netlify.toml
rm -f server/netlify.toml
rm -f .env.netlify

# Remove Netlify build scripts
rm -f netlify-build.sh
rm -f netlify-build-simple.sh

# Remove deployment scripts
rm -f deploy.sh
rm -f test-deployment.sh

# Remove the entire netlify directory
rm -rf netlify

# Remove any other deployment-related files
rm -f NETLIFY_DEPLOYMENT.md
rm -f DEPLOYMENT_GUIDE.md
rm -f QUICK_DEPLOY.md
rm -f WEBSOCKET_DEPLOYMENT.md

# Update package.json to remove Netlify-related scripts
echo "Updating package.json to remove Netlify-related scripts..."
sed -i '' '/build:netlify/d' package.json

echo "Cleanup complete! This branch is now ready for local development only."
