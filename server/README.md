
# Roadside Relief API

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Environment Variables
Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roadside-relief
JWT_SECRET=your_secure_jwt_secret_here
```

### Installation
1. Install dependencies
```
npm install
```

2. Start development server
```
npm run dev
```

3. Start production server
```
npm start
```

## MongoDB Schema Requirements

### Collections

#### Users Collection
- Stores information about customers requesting roadside assistance
- Fields: fullName, email, phone, password (hashed), driverLicense, licensePlate, userType, createdAt

#### Helpers Collection
- Stores information about service providers (roadside assistants)
- Fields: fullName, email, phone, password (hashed), services, experience, vehicleInfo, isAvailable, isVerified, location, rating, totalRatings, userType, createdAt

#### Requests Collection
- Stores all assistance requests
- Fields: user, serviceType, description, location, status, helper, estimatedPrice, isUrgent, payment, rating, review, acceptedAt, startedAt, completedAt, cancelledAt, createdAt

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user or helper
- POST `/api/auth/login` - Login for users and helpers

### User Operations
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/history` - Get user request history

### Helper Operations
- GET `/api/helpers/profile` - Get helper profile
- PUT `/api/helpers/profile` - Update helper profile
- POST `/api/helpers/availability` - Update helper availability status
- GET `/api/helpers/earnings` - Get helper earnings data

### Request Operations
- POST `
/api/requests` - Create new assistance request
- GET `/api/requests/user` - Get user's requests
- GET `/api/requests/helper` - Get helper's requests
- GET `/api/requests/available` - Get available requests for helpers
- POST `/api/requests/:id/accept` - Accept a request
- POST `/api/requests/:id/status` - Update request status
- GET `/api/requests/:id` - Get single request details

## Authentication Flow

The API uses JWT (JSON Web Tokens) for authentication. When a user or helper logs in, a token is generated and returned to the client. This token must be included in the `Authorization` header of each request that requires authentication.

Example header:
```
Authorization: Bearer <token>
```

The server will verify the token and identify the user or helper making the request.
