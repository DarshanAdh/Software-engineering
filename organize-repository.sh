#!/bin/bash

# Script to organize the repository structure

echo "Organizing repository structure..."

# Create directories if they don't exist
mkdir -p docs scripts

# Move documentation files to docs directory
echo "Moving documentation files to docs directory..."
mv *.md docs/ 2>/dev/null
# Keep README.md at root
mv docs/README.md . 2>/dev/null

# Move script files to scripts directory
echo "Moving script files to scripts directory..."
mv *.sh scripts/ 2>/dev/null
# Keep this script in the root until it completes
cp scripts/organize-repository.sh . 2>/dev/null

# Move test files to scripts directory
echo "Moving test files to scripts directory..."
mv test-*.js scripts/ 2>/dev/null
mv test-*.mjs scripts/ 2>/dev/null
mv detailed_white_box_testing_results.txt docs/ 2>/dev/null

# Move other files to appropriate directories
echo "Moving other files to appropriate directories..."
mv project-structure.txt docs/ 2>/dev/null
mv copy-env.js scripts/ 2>/dev/null

# Clean up unnecessary files
echo "Cleaning up unnecessary files..."
rm -f *.zip 2>/dev/null

# Create a new .gitignore file
echo "Updating .gitignore file..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
build
dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.netlify

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Local backup files
*.zip
*.backup
EOF

echo "Organization complete!"
echo "The repository now has a cleaner structure with:"
echo "- client/: Frontend code"
echo "- server/: Backend code"
echo "- docs/: Documentation files"
echo "- scripts/: Utility scripts"
echo "- Root: Essential configuration files"
