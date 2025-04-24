# Roadside Assistance - Local Development

This branch is a clean backup of the Roadside Assistance project, configured specifically for local development without any Netlify or deployment-related files.

## Getting Started

### Prerequisites

- Node.js (v18.17.1 or later)
- MongoDB (local or Atlas)

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb+srv://softeng:softeng123@cluster0.j8hvx.mongodb.net/roadside-assistance?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mysupersecretkey123456789
PORT=5001
NODE_ENV=development
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

Start the development server:

```bash
npm run dev:concurrent
```

This will start both the frontend and backend servers concurrently.

- Frontend: http://localhost:8081
- Backend: http://localhost:5001

## Features

- User authentication
- Helper registration and management
- Roadside assistance request creation and tracking
- Admin dashboard
- Interactive maps with Leaflet/OpenStreetMap
- Real-time updates with WebSockets
