# Local Development Backup

This branch is a clean backup of the Roadside Assistance project, configured specifically for local development without any Netlify or deployment-related files.

## Purpose

This branch provides a simplified version of the codebase that:

1. Removes all Netlify configuration files
2. Removes all deployment scripts
3. Focuses solely on local development
4. Maintains all core functionality

## Getting Started

### Prerequisites

- Node.js (v18.17.1 or later)
- MongoDB (local or Atlas)

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

2. Create a `.env` file in the `server` directory with the same variables.

### Installation

1. Install dependencies:

```bash
npm install
```

2. Install server dependencies:

```bash
cd server
npm install
cd ..
```

### Running the Application

1. Start the development server:

```bash
npm run dev:concurrent
```

This will start both the frontend and backend servers concurrently.

- Frontend: http://localhost:8081
- Backend: http://localhost:5001

## Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run server` - Start the backend server
- `npm run client` - Start the frontend client
- `npm run dev:concurrent` - Start both frontend and backend servers
- `npm run build` - Build the frontend for production

## Features

- User authentication
- Helper registration and management
- Roadside assistance request creation and tracking
- Admin dashboard
- Interactive maps with Leaflet/OpenStreetMap
- Real-time updates with WebSockets

## Database

The application uses MongoDB for data storage. You can use either a local MongoDB instance or MongoDB Atlas.

## Note

This branch is intended for local development only. If you need to deploy the application, please refer to the main branch which includes all the necessary deployment configurations.
