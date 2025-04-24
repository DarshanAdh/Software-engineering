# Creating a Local Development Backup Branch

Follow these steps to create a clean backup branch for local development without any Netlify or deployment-related files.

## Step 1: Create a New Branch on GitHub

1. Go to your GitHub repository: https://github.com/DarshanAdh/Software-engineering
2. Click on the "main" or "master" branch dropdown
3. Type "local-development-backup" in the search box
4. Click "Create branch: local-development-backup from 'master'"

## Step 2: Clone the Repository with the New Branch

```bash
# Clone the repository
git clone https://github.com/DarshanAdh/Software-engineering.git

# Navigate to the repository
cd Software-engineering

# Checkout the new branch
git checkout local-development-backup
```

## Step 3: Run the Cleanup Script

```bash
# Make the cleanup script executable
chmod +x cleanup-for-local-dev.sh

# Run the cleanup script
./cleanup-for-local-dev.sh
```

## Step 4: Update the Package.json File

```bash
# Replace the package.json file with the local version
mv package.json.local package.json
```

## Step 5: Create a Local Environment File

```bash
# Create a .env file from the template
cp .env.local.template .env
```

## Step 6: Commit and Push the Changes

```bash
# Add all changes
git add .

# Commit the changes
git commit -m "Create clean local development backup without Netlify or deployment files"

# Push the changes
git push origin local-development-backup
```

## Step 7: Start Local Development

```bash
# Install dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Start the development server
npm run dev:concurrent
```

Your local development environment is now ready to use without any Netlify or deployment-related files!
