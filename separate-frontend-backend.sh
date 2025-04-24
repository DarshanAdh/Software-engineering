#!/bin/bash

# Script to separate frontend and backend code

echo "Separating frontend and backend code..."

# Create client directory if it doesn't exist
mkdir -p client

# Move frontend files to client directory
echo "Moving frontend files to client directory..."

# Copy package.json and create a frontend-specific version
echo "Creating client package.json..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Keep only frontend-related dependencies
const frontendDeps = {};
const frontendDevDeps = {};

// Frontend dependencies to keep
const keepDeps = [
  '@hookform', '@radix-ui', '@tanstack', 'class-variance-authority', 'clsx', 'cmdk',
  'leaflet', 'lucide-react', 'next-themes', 'react', 'react-dom', 'react-hook-form',
  'react-leaflet', 'react-remove-scroll', 'react-router-dom', 'sonner', 'tailwind-merge',
  'tailwindcss-animate', 'zod'
];

// Frontend devDependencies to keep
const keepDevDeps = [
  '@types', '@typescript-eslint', '@vitejs', 'autoprefixer', 'eslint',
  'postcss', 'tailwindcss', 'typescript', 'vite'
];

// Filter dependencies
for (const [key, value] of Object.entries(pkg.dependencies || {})) {
  if (keepDeps.some(dep => key.startsWith(dep) || key === dep)) {
    frontendDeps[key] = value;
  }
}

// Filter devDependencies
for (const [key, value] of Object.entries(pkg.devDependencies || {})) {
  if (keepDevDeps.some(dep => key.startsWith(dep) || key === dep)) {
    frontendDevDeps[key] = value;
  }
}

// Create frontend package.json
const frontendPkg = {
  name: 'roadside-assistance-client',
  private: true,
  version: '0.1.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'tsc && vite build',
    preview: 'vite preview',
    lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
  },
  dependencies: frontendDeps,
  devDependencies: frontendDevDeps
};

fs.writeFileSync('client/package.json', JSON.stringify(frontendPkg, null, 2));
" 2>/dev/null

# Move frontend files
echo "Moving frontend source files..."
cp -r src client/
cp -r public client/
cp index.html client/
cp vite.config.ts client/
cp tsconfig.json client/
cp tsconfig.app.json client/
cp tsconfig.node.json client/
cp postcss.config.js client/
cp tailwind.config.ts client/
cp components.json client/
cp .env.development client/
cp .env.production client/
cp eslint.config.js client/

# Create a root package.json with scripts to run both frontend and backend
echo "Creating root package.json..."
cat > package.json << 'EOF'
{
  "name": "roadside-assistance",
  "version": "1.0.0",
  "description": "Roadside Assistance Application",
  "scripts": {
    "client": "cd client && npm run dev",
    "server": "cd server && npm run dev",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "build": "npm run build:client && npm run build:server",
    "start": "cd server && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# Create a .env file for the client
echo "Creating client .env file..."
cat > client/.env << 'EOF'
VITE_API_URL=http://localhost:5001
EOF

echo "Separation complete!"
echo "To install dependencies, run: npm run install:all"
echo "To start the development servers, run: npm run dev"
