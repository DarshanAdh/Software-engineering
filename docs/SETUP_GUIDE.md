# Roadside Relief - Setup Guide

This guide provides detailed instructions for setting up the Roadside Relief application, a platform that connects stranded drivers with nearby helpers for roadside assistance.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Setting Up the Frontend](#setting-up-the-frontend)
  - [Setting Up the Backend](#setting-up-the-backend)
  - [Setting Up MongoDB](#setting-up-mongodb)
- [Running the Application](#running-the-application)
- [MongoDB Collections and Indexes](#mongodb-collections-and-indexes)
- [Sample Data Setup](#sample-data-setup)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Installation

### Setting Up the Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/roadside-caretakers.git
   cd roadside-caretakers
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

### Setting Up the Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/roadside-relief
   JWT_SECRET=your_secure_jwt_secret_here
   ```

   Note: Replace `your_secure_jwt_secret_here` with a strong secret key for JWT token generation.

### Setting Up MongoDB

1. Start MongoDB service on your local machine:
   ```bash
   # On Linux
   sudo systemctl start mongod
   
   # On macOS (if installed via Homebrew)
   brew services start mongodb-community
   
   # On Windows
   # MongoDB should be running as a service
   ```

   Alternatively, you can use MongoDB Atlas:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Set up database access (create a user with password)
   - Set up network access (allow access from your IP)
   - Get your connection string and update the MONGODB_URI in your .env file

2. Create a new database named `roadside-relief`:
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Create and use the database
   use roadside-relief
   ```

3. Create the required collections and indexes:
   ```javascript
   // Create collections
   db.createCollection("users")
   db.createCollection("helpers")
   db.createCollection("requests")
   
   // Create indexes
   db.users.createIndex({ "email": 1 }, { unique: true })
   db.helpers.createIndex({ "email": 1 }, { unique: true })
   db.helpers.createIndex({ "location": "2dsphere" })
   db.requests.createIndex({ "location": "2dsphere" })
   db.requests.createIndex({ "user": 1 })
   db.requests.createIndex({ "helper": 1 })
   db.requests.createIndex({ "status": 1 })
   ```

## Running the Application

1. Start the backend server:
   ```bash
   # From the server directory
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   # From the project root directory
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:5001/api
   - Helper Dashboard: http://localhost:8081/helper-dashboard

## MongoDB Collections and Indexes

The application uses the following MongoDB collections:

### Users Collection
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  password: String (hashed),
  driverLicense: String,
  licensePlate: String,
  userType: String (enum: ['customer', 'helper', 'admin']),
  createdAt: Date
}
```

**Indexes:**
- `email`: Unique index

### Helpers Collection
```javascript
{
  fullName: String,
  email: String,
  phone: String,
  password: String (hashed),
  services: Array of String,
  experience: String,
  vehicleInfo: String,
  isAvailable: Boolean,
  isVerified: Boolean,
  location: {
    type: String,
    coordinates: [Number, Number]
  },
  rating: Number,
  totalRatings: Number,
  userType: String
}
```

**Indexes:**
- `email`: Unique index
- `location`: 2dsphere index for geospatial queries

### Requests Collection
```javascript
{
  user: ObjectId (ref: 'User'),
  serviceType: String (enum: ['tire', 'battery', 'lockout', 'fuel', 'other', 'tow']),
  description: String,
  location: {
    type: String,
    coordinates: [Number, Number],
    address: String
  },
  status: String (enum: ['pending', 'accepted', 'inProgress', 'completed', 'cancelled']),
  helper: ObjectId (ref: 'Helper'),
  estimatedPrice: Number,
  isUrgent: Boolean,
  vehicle: String,
  createdAt: Date,
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date
}
```

**Indexes:**
- `location`: 2dsphere index for geospatial queries
- `user`: Index for faster user-based queries
- `helper`: Index for faster helper-based queries
- `status`: Index for status-based queries

## Sample Data Setup

To set up sample data with the specified users, you can use the MongoDB shell or a tool like MongoDB Compass.

### Customer: Cristiano Ronaldo

```javascript
db.users.insertOne({
  fullName: "Cristiano Ronaldo",
  email: "cr7@example.com",
  phone: "1234567890",
  password: "$2a$10$XFE/UQEjIjzWUHlmAw3ZLeJVIQ8Jo.7dSL.JFy9nhQn1qbxRWqvBS", // Password: Ronaldo@123
  driverLicense: "CR7-12345",
  licensePlate: "GOAT-7",
  userType: "customer",
  createdAt: new Date()
})
```

### Helper: IShowSpeed

```javascript
db.helpers.insertOne({
  fullName: "IShowSpeed",
  email: "speed@example.com",
  phone: "9876543210",
  password: "$2a$10$XFE/UQEjIjzWUHlmAw3ZLeJVIQ8Jo.7dSL.JFy9nhQn1qbxRWqvBS", // Password: Speed@123
  services: ["Flat Tire Change", "Battery Jump-Start", "Fuel Delivery"],
  experience: "5 years of experience helping stranded drivers. Specialized in tire changes and battery services.",
  vehicleInfo: "Ford F-150 Truck (2020), Red",
  isAvailable: true,
  isVerified: true,
  location: {
    type: "Point",
    coordinates: [-73.9857, 40.7484] // New York City coordinates
  },
  rating: 4.8,
  totalRatings: 156,
  userType: "helper"
})
```

### Sample Request

```javascript
// Get the ObjectIds of the inserted users
const customer = db.users.findOne({ email: "cr7@example.com" })
const helper = db.helpers.findOne({ email: "speed@example.com" })

db.requests.insertOne({
  user: customer._id,
  serviceType: "tire",
  description: "Flat tire on my Ferrari. Need urgent assistance.",
  location: {
    type: "Point",
    coordinates: [-73.9837, 40.7494], // Near Times Square
    address: "Times Square, New York, NY"
  },
  status: "accepted",
  helper: helper._id,
  estimatedPrice: 120,
  isUrgent: true,
  vehicle: "Ferrari 458 (Red)",
  createdAt: new Date(),
  acceptedAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
})
```

## Project Structure

```
roadside-caretakers/
├── public/                  # Static files
│   └── roadside.jpg         # Background image
├── server/                  # Backend code
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── User.js          # User model
│   │   ├── Helper.js        # Helper model
│   │   └── Request.js       # Request model
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── helpers.js       # Helper routes
│   │   ├── requests.js      # Request routes
│   │   └── users.js         # User routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
├── src/                     # Frontend code
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── home/            # Home page components
│   │   │   ├── Hero.tsx     # Hero section
│   │   │   ├── Features.tsx # Features section
│   │   │   └── HowItWorks.tsx # How it works section
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.tsx   # Navigation bar
│   │   │   └── Footer.tsx   # Footer
│   │   └── ui/              # UI components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Home page
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   ├── Dashboard.tsx    # Customer dashboard
│   │   ├── HelperDashboard.tsx # Helper dashboard
│   │   └── Request.tsx      # Request creation page
│   ├── config/              # Configuration
│   │   └── api.ts           # API endpoints
│   ├── App.tsx              # Main App component
│   ├── index.css            # Global styles
│   └── main.tsx             # Entry point
├── index.html               # HTML template
├── package.json             # Frontend dependencies
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite config
```

## Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection issues:

1. Ensure MongoDB is running:
   ```bash
   # Check MongoDB status
   mongosh --eval "db.runCommand({ ping: 1 })"
   ```

2. Verify your connection string in the `.env` file.

3. Check MongoDB logs for errors:
   ```bash
   # Location varies by OS
   cat /var/log/mongodb/mongod.log
   ```

### Frontend Development Server Issues

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check for port conflicts:
   ```bash
   # Find processes using port 8081
   lsof -i :8081
   # Kill the process if needed
   kill -9 <PID>
   ```

### Login Issues with Sample Data

If you can't log in with the sample data:

1. The provided passwords are hashed. For testing, you can use:
   - Email: cr7@example.com
   - Password: Ronaldo@123
   
   - Email: speed@example.com
   - Password: Speed@123

2. If login still fails, you may need to create the users through the registration form instead.

---

For additional help, please refer to the project documentation or contact the development team.
