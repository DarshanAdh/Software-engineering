# Deployment Guide

This guide explains how to deploy the Roadside Assistance application to Netlify (frontend) and Heroku (backend).

## Prerequisites

Before you begin, make sure you have the following:

1. **Node.js and npm** installed on your machine
2. **Git** installed on your machine
3. **Netlify account** - [Sign up here](https://app.netlify.com/signup)
4. **Heroku account** - [Sign up here](https://signup.heroku.com/)
5. **Heroku CLI** installed - [Installation guide](https://devcenter.heroku.com/articles/heroku-cli)
6. **MongoDB Atlas account** - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

## Deployment Options

You have three options for deploying the application:

1. **Frontend only** - Deploy just the React frontend to Netlify
2. **Backend only** - Deploy just the Express backend to Heroku
3. **Both** - Deploy both frontend and backend

## Automated Deployment

We've created a deployment script that automates the deployment process:

```bash
# Make the script executable if it's not already
chmod +x scripts/deploy.sh

# Run the deployment script
./scripts/deploy.sh
```

The script will guide you through the deployment process.

## Manual Deployment

If you prefer to deploy manually, follow these steps:

### Frontend Deployment (Netlify)

1. **Build the frontend**:
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy to Netlify**:
   - Option 1: Use Netlify CLI:
     ```bash
     # Install Netlify CLI if you don't have it
     npm install -g netlify-cli
     
     # Deploy
     netlify deploy --prod
     ```
   
   - Option 2: Drag and drop the `client/dist` folder to Netlify's web interface

3. **Configure environment variables**:
   - In Netlify's dashboard, go to Site settings > Build & deploy > Environment
   - Add the following variable:
     - `VITE_API_URL`: URL of your Heroku backend (e.g., https://roadside-assistance-api.herokuapp.com)

### Backend Deployment (Heroku)

1. **Prepare the backend**:
   ```bash
   cd server
   ```

2. **Create a Heroku app** (if you don't have one already):
   ```bash
   heroku login
   heroku create roadside-assistance-api
   ```

3. **Configure environment variables**:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

4. **Deploy to Heroku**:
   ```bash
   git init
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku master
   ```

5. **Verify the deployment**:
   ```bash
   heroku open
   ```

## Post-Deployment Steps

After deploying both frontend and backend:

1. **Update CORS settings** if needed:
   - If you encounter CORS errors, make sure your backend's CORS configuration includes your Netlify domain

2. **Test the application**:
   - Navigate to your Netlify URL
   - Test all features to ensure they work with the deployed backend

3. **Monitor logs**:
   - Netlify: Site settings > Functions > Logs
   - Heroku: `heroku logs --tail`

## Troubleshooting

### Common Issues

1. **CORS errors**:
   - Make sure your backend's CORS configuration includes your Netlify domain
   - Check the browser console for specific error messages

2. **Environment variables**:
   - Verify that all required environment variables are set correctly
   - Remember that changes to environment variables require redeploying the application

3. **Database connection issues**:
   - Ensure your MongoDB Atlas cluster is configured to accept connections from anywhere
   - Check that your connection string is correct

4. **Deployment failures**:
   - Check the deployment logs for specific error messages
   - Verify that your code works locally before deploying

### Getting Help

If you encounter issues not covered in this guide:

1. Check the Netlify and Heroku documentation
2. Look for error messages in the deployment logs
3. Search for solutions on Stack Overflow or other developer forums

## Maintenance

### Updating Your Deployment

To update your deployment after making changes to your code:

1. **Frontend (Netlify)**:
   ```bash
   cd client
   npm run build
   netlify deploy --prod
   ```

2. **Backend (Heroku)**:
   ```bash
   cd server
   git add .
   git commit -m "Update backend"
   git push heroku master
   ```

### Monitoring

- **Netlify**: Monitor your site's performance and deployment status in the Netlify dashboard
- **Heroku**: Use `heroku logs --tail` to monitor your backend in real-time
