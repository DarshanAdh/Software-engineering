
# Roadside Relief - Roadside Assistance App

A full-stack application connecting stranded drivers with nearby helpers for roadside assistance.

## Data Flow Between Frontend and Backend

### Authentication Flow

1. **Registration**:
   - Frontend collects user data (name, email, password, etc.) through the Register form
   - Data is validated on the client with Zod and React Hook Form
   - Request is sent to `/api/auth/register` endpoint
   - Backend validates data, hashes the password, and stores user in MongoDB (User or Helper collection)
   - Success/error response returned to frontend

2. **Login**:
   - Frontend collects credentials (email, password, userType) through the Login form
   - Request is sent to `/api/auth/login` endpoint
   - Backend validates credentials and generates JWT token
   - Token and user info returned to frontend
   - Frontend stores token in localStorage and updates authentication context

3. **Authentication State**:
   - `AuthContext` maintains authentication state across the app
   - Token is included in Authorization header for authenticated requests
   - Backend middleware validates token for protected routes

### User/Helper Data Flow

1. **User Profile**:
   - Profile data is fetched from `/api/users/profile` endpoint
   - Updates sent to `/api/users/profile` with PUT method
   - All requests include JWT token in Authorization header

2. **Helper Profile**:
   - Helper-specific data accessed via `/api/helpers/profile`
   - Availability status updated via `/api/helpers/availability`

### Request Processing Flow

1. **Creating Requests**:
   - Customer submits request details via RequestForm
   - Data sent to `/api/requests` endpoint
   - Backend creates new request in Requests collection
   - Response includes request ID and status

2. **Viewing Requests**:
   - Customers see their requests via `/api/requests/user`
   - Helpers see nearby/available requests via `/api/helpers/requests`
   - Individual request details via `/api/requests/:id`

3. **Updating Requests**:
   - Status updates via `/api/requests/:id/status`
   - Helper accepts request via `/api/requests/:id/accept`
   - Each update modifies the request document in MongoDB

## Database Collections and Schemas

### User Collection
Stores information about customers requesting assistance.

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

### Helper Collection
Stores information about service providers (roadside assistance helpers).

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

### Request Collection
Stores all assistance requests.

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

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user (customer or helper)
- `POST /api/auth/login` - Login existing user and get token

### User Routes
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/requests` - Get user's assistance requests

### Helper Routes
- `GET /api/helpers/profile` - Get helper profile
- `PUT /api/helpers/profile` - Update helper profile
- `PUT /api/helpers/availability` - Update helper availability status
- `GET /api/helpers/requests` - Get nearby available requests

### Request Routes
- `POST /api/requests` - Create new assistance request
- `GET /api/requests/user` - Get requests for current user
- `GET /api/requests/:id` - Get specific request details
- `PUT /api/requests/:id/status` - Update request status
- `PUT /api/requests/:id/accept` - Helper accepts a request

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd server && npm install
   ```
3. Set up MongoDB:
   - Create a MongoDB database (local or Atlas)
   - Configure connection string in server/.env file

4. Create `.env` file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ```

5. Start the backend server:
   ```
   cd server
   npm start
   ```

6. Start the frontend development server:
   ```
   npm run dev
   ```
