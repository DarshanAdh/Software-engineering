# Roadside Relief - Quick Start Guide

This guide provides the essential steps to get the Roadside Relief application up and running quickly.

## Prerequisites

- Node.js (v14+)
- npm (v6+)
- MongoDB (local or Atlas)

## Step 1: Install Dependencies

Install both frontend and backend dependencies:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Step 2: Configure Environment

Create a `.env` file in the server directory:

```bash
cd server
touch .env
```

Add the following content to the `.env` file:

```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/roadside-relief
JWT_SECRET=your_secure_jwt_secret_here
```

## Step 3: Set Up the Database

Run the database setup script to create collections, indexes, and sample data:

```bash
# From the server directory
npm run setup-db
```

This will create:
- A customer account for "Cristiano Ronaldo" (cr7@example.com / Ronaldo@123)
- A helper account for "IShowSpeed" (speed@example.com / Speed@123)
- A sample service request

## Step 4: Start the Application

Start both the backend and frontend servers:

```bash
# Start the backend server (from the server directory)
npm run dev

# In a new terminal, start the frontend server (from the project root)
npm run dev
```

## Step 5: Access the Application

- Frontend: http://localhost:8081
- Backend API: http://localhost:5001/api
- Helper Dashboard: http://localhost:8081/helper-dashboard

## Login Credentials

### Customer
- Email: cr7@example.com
- Password: Ronaldo@123

### Helper
- Email: speed@example.com
- Password: Speed@123

## Features to Try

1. **Customer Flow**:
   - Log in as Cristiano Ronaldo
   - View the dashboard with existing requests
   - Create a new roadside assistance request
   - Track request status

2. **Helper Flow**:
   - Log in as IShowSpeed
   - View the helper dashboard
   - See available and accepted requests
   - Update request status

## Troubleshooting

If you encounter any issues, please refer to the detailed [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more information.

For more detailed documentation on the project structure and API endpoints, see the [README.md](./README.md).
