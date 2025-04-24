
# Roadside Relief API Documentation

This document provides detailed information about the Roadside Relief API endpoints, data models, and integration with the frontend application.

## Table of Contents

1. [API Overview](#api-overview)
2. [API Endpoints](#api-endpoints)
3. [Database Schema](#database-schema)
4. [Authentication Flow](#authentication-flow)
5. [Request Flow](#request-flow)
6. [Helper Flow](#helper-flow)
7. [Frontend-Backend Integration](#frontend-backend-integration)
8. [Error Handling](#error-handling)
9. [Deployment Considerations](#deployment-considerations)

## API Overview

The Roadside Relief API is built with Node.js and Express, using MongoDB as the database. It provides endpoints for user authentication, profile management, request creation and management, and helper services.

### Base URL

```
http://localhost:5000/api
```

## API Endpoints

### Authentication

#### Register User

```
POST /auth/register
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "securepassword",
  "driverLicense": "DL12345678",
  "licensePlate": "ABC123",
  "userType": "customer"
}
```

#### Register Helper

```
POST /auth/register
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "password": "securepassword",
  "services": ["Flat Tire Change", "Battery Jump-Start"],
  "experience": "5 years of experience as a mechanic",
  "vehicleInfo": "Ford F-150 2020",
  "userType": "helper"
}
```

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword",
  "userType": "customer"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "fullName": "John Smith",
    "email": "john@example.com",
    "userType": "customer"
  }
}
```

### User Operations

#### Get User Profile

```
GET /users/profile
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "1234567890",
  "driverLicense": "DL12345678",
  "licensePlate": "ABC123",
  "userType": "customer"
}
```

#### Update User Profile

```
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request Body:**
```json
{
  "fullName": "John Smith Jr.",
  "phone": "1234567890",
  "licensePlate": "XYZ789"
}
```

#### Get User Request History

```
GET /users/requests
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

### Helper Operations

#### Get Helper Profile

```
GET /helpers/profile
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0987654321",
  "services": ["Flat Tire Change", "Battery Jump-Start"],
  "experience": "5 years of experience as a mechanic",
  "vehicleInfo": "Ford F-150 2020",
  "isAvailable": true,
  "isVerified": true,
  "location": {
    "type": "Point",
    "coordinates": [-73.9857, 40.7484]
  },
  "rating": 4.8,
  "totalRatings": 25,
  "userType": "helper"
}
```

#### Update Helper Profile

```
PUT /helpers/profile
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request Body:**
```json
{
  "fullName": "Jane M. Doe",
  "phone": "0987654321",
  "services": ["Flat Tire Change", "Battery Jump-Start", "Lockout Assistance"],
  "vehicleInfo": "Ford F-150 2022"
}
```

#### Update Helper Availability

```
POST /helpers/availability
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request Body:**
```json
{
  "isAvailable": true,
  "location": {
    "coordinates": [-73.9857, 40.7484]
  }
}
```

#### Get Helper Earnings

```
GET /helpers/earnings
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Response:**
```json
{
  "today": 75,
  "week": 320,
  "month": 1450,
  "total": 5200
}
```

### Request Operations

#### Create Request

```
POST /requests
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request Body:**
```json
{
  "serviceType": "Flat Tire Change",
  "description": "I have a flat tire on my front left wheel",
  "location": {
    "coordinates": [-73.9857, 40.7484],
    "address": "123 Main St, New York, NY 10001"
  },
  "isUrgent": false,
  "vehicle": "Honda Civic 2019, Blue"
}
```

**Response:**
```json
{
  "_id": "request-id",
  "user": {
    "fullName": "John Smith",
    "phone": "1234567890"
  },
  "serviceType": "Flat Tire Change",
  "description": "I have a flat tire on my front left wheel",
  "location": {
    "type": "Point",
    "coordinates": [-73.9857, 40.7484],
    "address": "123 Main St, New York, NY 10001"
  },
  "status": "pending",
  "estimatedPrice": 30,
  "isUrgent": false,
  "createdAt": "2023-04-15T18:30:00Z"
}
```

#### Get User's Requests

```
GET /requests/user
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

#### Get Helper's Requests

```
GET /requests/helper
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

#### Get Available Requests (for helpers)

```
GET /requests/available
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

#### Accept a Request (helper)

```
POST /requests/:id/accept
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

#### Update Request Status

```
POST /requests/:id/status
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

**Request Body:**
```json
{
  "status": "in_progress"
}
```

**For completing a request with review (customer only):**
```json
{
  "status": "completed",
  "rating": 5,
  "review": "Great service, very professional!"
}
```

#### Get Single Request

```
GET /requests/:id
```

**Headers:**
```
Authorization: Bearer jwt-token-here
```

## Database Schema

### User Schema

```javascript
{
  fullName: String (required),
  email: String (required, unique, lowercase),
  phone: String (required),
  password: String (required, hashed),
  driverLicense: String (required),
  licensePlate: String (required),
  userType: String (enum: ['customer', 'helper', 'admin'], default: 'customer'),
  createdAt: Date,
  updatedAt: Date
}
```

### Helper Schema

```javascript
{
  fullName: String (required),
  email: String (required, unique, lowercase),
  phone: String (required),
  password: String (required, hashed),
  services: Array of Strings (required),
  experience: String (required),
  vehicleInfo: String (required),
  isAvailable: Boolean (default: false),
  isVerified: Boolean (default: false),
  location: {
    type: String (default: 'Point'),
    coordinates: [Number, Number] (longitude, latitude)
  },
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  userType: String (default: 'helper'),
  createdAt: Date,
  updatedAt: Date
}
```

### Request Schema

```javascript
{
  user: ObjectId (ref: 'User', required),
  serviceType: String (required),
  description: String (required),
  location: {
    type: String (default: 'Point'),
    coordinates: [Number, Number],
    address: String (required)
  },
  status: String (enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'pending'),
  helper: ObjectId (ref: 'Helper', default: null),
  estimatedPrice: Number,
  isUrgent: Boolean (default: false),
  payment: {
    status: String (default: 'pending'),
    amount: Number,
    method: String,
    transactionId: String
  },
  rating: Number,
  review: String,
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication Flow

1. **Registration:**
   - User submits registration form
   - Backend validates data
   - Password is hashed
   - User is created in the database
   - Success message is returned

2. **Login:**
   - User submits login form with email, password, and userType
   - Backend verifies credentials
   - If valid, JWT token is generated and returned
   - Frontend stores token in localStorage
   - User data is stored in AuthContext

3. **Authentication State:**
   - Token is included in the Authorization header for authenticated requests
   - Backend middleware validates token and attaches user info to request object
   - Protected routes check for valid token

## Request Flow

1. **Creating a Request:**
   - Customer fills out request form (service type, location, description)
   - Backend creates request with 'pending' status
   - Estimated price is calculated based on service type and urgency
   - Request is stored in the database with customer ID

2. **For Helpers:**
   - Available helpers can see nearby pending requests
   - Helper accepts a request
   - Request status changes to 'accepted'
   - Helper and customer can communicate

3. **Request Lifecycle:**
   - Pending → Accepted → In Progress → Completed
   - Helper marks request as 'in_progress' when they arrive
   - Customer marks request as 'completed' when service is done
   - Customer can provide rating and review
   - Payment is processed

## Helper Flow

1. **Availability Management:**
   - Helper toggles availability status
   - When available, helper's location is updated
   - Helper can see nearby requests

2. **Accepting and Completing Jobs:**
   - Helper accepts a request
   - Helper updates request status as they progress
   - Helper receives payment upon completion
   - Helper's rating is updated based on customer reviews

## Frontend-Backend Integration

### API Service

The frontend uses a centralized API service to interact with the backend:

```javascript
// Example from src/services/api.ts

// Auth API calls
export const authAPI = {
  login: async (email, password, userType) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType }),
    });
    
    return handleResponse(response);
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },
};
```

### Authentication Context

The frontend maintains authentication state using React Context:

```javascript
// Example from src/contexts/AuthContext.tsx

const login = async (email, password, userType) => {
  setIsLoading(true);
  
  try {
    const result = await authAPI.login(email, password, userType);
    
    // Store auth data
    localStorage.setItem("token", result.token);
    localStorage.setItem("userId", result.user.id);
    localStorage.setItem("userName", result.user.fullName);
    localStorage.setItem("userType", result.user.userType);
    
    setUser({
      id: result.user.id,
      fullName: result.user.fullName,
      email: result.user.email,
      userType: result.user.userType
    });
    
    setIsAuthenticated(true);
    
    // Navigate based on user type
    if (userType === "helper") {
      navigate("/helper-dashboard");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

### Data Fetching with React Query

For efficient data fetching, caching, and state management, the application uses React Query:

```javascript
// Example usage in a component

const { data: requests, isLoading, error } = useQuery({
  queryKey: ['userRequests'],
  queryFn: async () => {
    const response = await requestAPI.getUserRequests();
    return response;
  }
});
```

## Error Handling

### Backend Error Handling

The backend uses consistent error responses:

```javascript
try {
  // Operation code
} catch (error) {
  console.error('Operation error:', error);
  res.status(500).json({ 
    message: 'Failed to perform operation',
    error: error.message
  });
}
```

### Frontend Error Handling

The frontend handles API errors using:

```javascript
try {
  // API call
} catch (error) {
  toast.error(error.message || "Operation failed. Please try again.");
  // Additional error handling
}
```

## Deployment Considerations

1. **Environment Variables**
   - Store sensitive information in environment variables
   - Different configurations for development and production

2. **CORS Configuration**
   - Configure CORS to allow requests only from trusted origins

3. **Security Best Practices**
   - Use HTTPS in production
   - Implement rate limiting
   - Set secure HTTP headers
   - Validate all user inputs

4. **Monitoring and Logging**
   - Implement comprehensive logging
   - Set up monitoring for API performance and errors

5. **Database Indexing**
   - Create indexes for frequently queried fields
   - Use geospatial indexes for location queries
