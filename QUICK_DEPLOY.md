# Quick Deployment Guide for Roadside Relief

Since you've already set up MongoDB Atlas, this guide focuses on the remaining steps to deploy your application.

## Step 1: Prepare Your Application for Deployment

1. **Set environment variables:**
   ```bash
   export MONGODB_URI="your_mongodb_atlas_connection_string"
   export JWT_SECRET="your_secure_random_string"
   ```

2. **Run the deployment preparation script:**
   ```bash
   ./deploy.sh
   ```

## Step 2: Deploy to Netlify

### Option 1: Deploy via Netlify CLI (Recommended for first deployment)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Log in to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize Netlify site:**
   ```bash
   netlify init
   ```
   - Select "Create & configure a new site"
   - Follow the prompts to set up your site

4. **Set environment variables:**
   ```bash
   netlify env:set MONGODB_URI "your_mongodb_atlas_connection_string"
   netlify env:set JWT_SECRET "your_secure_random_string"
   ```

5. **Deploy your site:**
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify UI (GitHub Integration)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Connect to Netlify:**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Select GitHub and authorize Netlify
   - Select your repository

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" and add environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string for JWT token generation
   - Click "Deploy site"

## Step 3: Test Your Deployment

1. **Wait for the deployment to complete**

2. **Test your application:**
   - Visit your Netlify site URL
   - Test user registration and login
   - Test core application features
   - Check for any errors in the Netlify function logs

## Troubleshooting Common Issues

### MongoDB Connection Issues

If you encounter MongoDB connection issues:

1. **Check your connection string:**
   - Ensure the username and password are correct
   - Make sure you've allowed network access from anywhere (0.0.0.0/0) or from Netlify's IP ranges

2. **Check Netlify environment variables:**
   - Go to Site settings > Build & deploy > Environment
   - Verify that `MONGODB_URI` is set correctly

3. **Check Netlify function logs:**
   - Go to Functions > Your function > Logs
   - Look for any connection errors

### WebSocket Issues

If you encounter WebSocket issues:

1. **WebSockets are not supported in Netlify Functions:**
   - Consider using a different service for WebSocket functionality
   - Options include:
     - Pusher
     - Socket.io with a dedicated server
     - AWS API Gateway WebSocket API

### Function Size Limits

If you encounter function size limits:

1. **Netlify Functions have a 50MB limit:**
   - Split large functions into smaller ones
   - Remove unnecessary dependencies
   - Use tree-shaking to reduce bundle size

## Post-Deployment Steps

1. **Set up a custom domain:**
   - Go to Netlify site settings > Domain management
   - Add your custom domain

2. **Enable HTTPS:**
   - Netlify automatically provisions SSL certificates via Let's Encrypt

3. **Set up continuous deployment:**
   - Netlify automatically deploys when you push to your repository
   - Configure build hooks for more advanced workflows
