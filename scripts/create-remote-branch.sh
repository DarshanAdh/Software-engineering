#!/bin/bash

# Script to create a remote branch for local development backup

echo "Creating remote branch for local development backup..."

# Step 1: Create an orphan branch (a branch with no history)
git checkout --orphan local-development-backup

# Step 2: Remove all files from the staging area
git rm -rf .

# Step 3: Copy the local development files
cp LOCAL_DEVELOPMENT.md README.md
cp .env .env.backup
cp package.json package.json.backup

# Step 4: Add the files to the staging area
git add README.md
git add .env.backup
git add package.json.backup
git add LOCAL_DEVELOPMENT.md
git add cleanup-for-local-dev.sh
git add CREATE_BACKUP_BRANCH.md

# Step 5: Commit the changes
git commit -m "Create clean local development backup branch"

# Step 6: Push the branch to GitHub
git push -u origin local-development-backup

echo "Remote branch 'local-development-backup' has been created!"
echo "You can now clone this branch for local development."
