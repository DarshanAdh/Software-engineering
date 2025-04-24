# Roadside Assistance Project Structure

This project has been reorganized into a cleaner structure with separate frontend and backend codebases.

## Project Structure

```
roadside-assistance/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   ├── .env                # Environment variables for frontend
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
│
├── server/                 # Backend Express application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── scripts/            # Utility scripts
│   ├── .env                # Environment variables for backend
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
│
├── package.json            # Root package.json with scripts
└── README.md               # Project documentation
```

## Development

To install all dependencies:

```bash
npm run install:all
```

To start both frontend and backend in development mode:

```bash
npm run dev
```

To start only the frontend:

```bash
npm run client
```

To start only the backend:

```bash
npm run server
```

## Building for Production

To build both frontend and backend:

```bash
npm run build
```

To build only the frontend:

```bash
npm run build:client
```

To build only the backend:

```bash
npm run build:server
```

## Starting in Production

To start the application in production mode:

```bash
npm start
```

## Environment Variables

### Frontend (.env in client directory)

- `VITE_API_URL`: URL of the backend API (default: http://localhost:5001)

### Backend (.env in server directory)

- `PORT`: Port for the server to listen on (default: 5001)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `NODE_ENV`: Environment (development, production)
