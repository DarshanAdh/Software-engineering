#!/bin/bash

# Script to organize the project into separate frontend and backend repositories

echo "Creating backup..."
cp -r Software-engineering Software-engineering-backup

echo "Creating frontend and backend directories..."
mkdir -p roadside-frontend roadside-backend

echo "Copying frontend files..."
cp -r Software-engineering/src roadside-frontend/
cp -r Software-engineering/public roadside-frontend/
cp Software-engineering/index.html roadside-frontend/
cp Software-engineering/vite.config.ts roadside-frontend/ 2>/dev/null || echo "No vite.config.ts file"
cp Software-engineering/tsconfig.json roadside-frontend/ 2>/dev/null || echo "No tsconfig.json file"
cp Software-engineering/tailwind.config.ts roadside-frontend/ 2>/dev/null || echo "No tailwind.config.ts file"
cp Software-engineering/postcss.config.js roadside-frontend/ 2>/dev/null || echo "No postcss.config.js file"
cp Software-engineering/eslint.config.js roadside-frontend/ 2>/dev/null || echo "No eslint.config.js file"

echo "Copying backend files..."
cp -r Software-engineering/server/* roadside-backend/

echo "Creating package.json files..."
cat > roadside-frontend/package.json << 'EOL'
{
  "name": "roadside-assistance-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.10",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tanstack/react-query": "^5.69.0",
    "@types/leaflet": "^1.9.17",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^1.1.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^0.344.0",
    "next-themes": "^0.4.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.1",
    "react-leaflet": "^4.2.1",
    "react-remove-scroll": "^2.6.3",
    "react-router-dom": "^6.22.1",
    "sonner": "^1.4.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.19",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.8.3",
    "vite": "^5.1.0"
  }
}
EOL

cat > roadside-backend/package.json << 'EOL'
{
  "name": "roadside-assistance-api",
  "version": "1.0.0",
  "description": "API server for Roadside Assistance application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "dev:watch": "nodemon server.js",
    "build": "npm install"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "moment": "^2.30.1",
    "mongoose": "^7.8.6",
    "ws": "^8.18.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOL

echo "Creating .env files..."
cat > roadside-frontend/.env << 'EOL'
VITE_API_URL=http://localhost:5001
EOL

cat > roadside-backend/.env << 'EOL'
MONGODB_URI=mongodb+srv://softeng:softeng123@cluster0.j8hvx.mongodb.net/roadside-assistance?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mysupersecretkey123456789
PORT=5001
NODE_ENV=development
EOL

echo "Creating README files..."
cat > roadside-frontend/README.md << 'EOL'
# Roadside Assistance Frontend

This is the frontend application for the Roadside Assistance project.

## Getting Started

### Prerequisites

- Node.js (v18.17.1 or later)
- npm (v9.0.0 or later)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Deployment

This frontend application is designed to be deployed to Netlify or Vercel.

### Deploying to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables:
   - `VITE_API_URL`: Your backend API URL

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   - `VITE_API_URL`: Your backend API URL
EOL

cat > roadside-backend/README.md << 'EOL'
# Roadside Assistance Backend API

This is the backend API for the Roadside Assistance project.

## Getting Started

### Prerequisites

- Node.js (v18.17.1 or later)
- npm (v9.0.0 or later)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
NODE_ENV=development
```

## Deployment

This backend API is designed to be deployed to Render.

### Deploying to Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Configure the service:
   - Name: roadside-assistance-api
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production
EOL

echo "Creating .gitignore files..."
cat > roadside-frontend/.gitignore << 'EOL'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOL

cat > roadside-backend/.gitignore << 'EOL'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOL

echo "Creating API configuration in frontend..."
mkdir -p roadside-frontend/src/config
cat > roadside-frontend/src/config/api.ts << 'EOL'
// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const apiConfig = {
  baseUrl: API_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      adminLogin: '/api/auth/admin/login',
    },
    users: {
      profile: '/api/users/profile',
      update: '/api/users/update',
    },
    helpers: {
      register: '/api/helpers/register',
      profile: '/api/helpers/profile',
      update: '/api/helpers/update',
      list: '/api/helpers',
    },
    requests: {
      create: '/api/requests',
      list: '/api/requests',
      userRequests: '/api/requests/user',
      helperRequests: '/api/requests/helper',
      details: (id: string) => `/api/requests/${id}`,
      accept: (id: string) => `/api/requests/${id}/accept`,
      complete: (id: string) => `/api/requests/${id}/complete`,
      cancel: (id: string) => `/api/requests/${id}/cancel`,
    },
    admin: {
      dashboard: '/api/admin/dashboard',
      users: '/api/admin/users',
      helpers: '/api/admin/helpers',
      approveHelper: (id: string) => `/api/admin/helpers/${id}/approve`,
      rejectHelper: (id: string) => `/api/admin/helpers/${id}/reject`,
      deleteUser: (id: string) => `/api/admin/users/${id}`,
    },
  },
};

export default apiConfig;
EOL

echo "Creating CORS configuration in backend..."
mkdir -p roadside-backend/middleware
cat > roadside-backend/middleware/cors.js << 'EOL'
// CORS middleware
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:3000',
  'https://roadside-assistance.netlify.app',
  'https://roadside-assistance.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
EOL

echo "Project organization complete!"
echo "Frontend: roadside-frontend"
echo "Backend: roadside-backend"
