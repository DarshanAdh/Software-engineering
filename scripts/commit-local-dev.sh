#!/bin/bash

# Script to commit and push the local development backup branch

# Remove any existing lock files
rm -f .git/index.lock

# Create a new branch
git checkout -b local-development-backup

# Add all changes
git add .

# Commit the changes
git commit -m "Create clean local development backup without Netlify or deployment files"

# Push the branch to GitHub
git push -u origin local-development-backup

echo "Local development backup branch has been created and pushed to GitHub!"
