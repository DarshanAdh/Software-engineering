# Roadside Relief Deployment Guide

This guide provides step-by-step instructions for deploying the Roadside Relief application to production.

## Prerequisites

- Node.js (v14+)
- npm (v6+)
- Git
- MongoDB Atlas account
- Netlify account

## Step 1: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas account and cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Create a new project (if needed)
   - Create a new cluster (free tier is sufficient to start)
   - Choose a cloud provider and region closest to your target users

2. **Configure database access:**
   - In the left sidebar, click "Database Access"
   - Click "Add New Database User"
   - Create a user with password authentication
   - Set appropriate permissions (readWrite to your database)
   - Save the username and password

3. **Configure network access:**
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - For development, add your current IP
   - For production, select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get your connection string:**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string (it will look like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/roadside-relief?retryWrites=true&w=majority`)
   - Replace `<username>` and `<password>` with your database user credentials
   - Replace `roadside-relief` with your preferred database name

## Step 2: Prepare Your Application for Deployment

1. **Clone your repository (if not already done):**
   ```bash
   git clone https://github.com/yourusername/roadside-caretakers.git
   cd roadside-caretakers
   ```

2. **Set environment variables:**
   ```bash
   export MONGODB_URI="your_mongodb_atlas_connection_string"
   export JWT_SECRET="your_secure_jwt_secret"
   ```

3. **Run the deployment preparation script:**
   ```bash
   ./deploy.sh
   ```

## Step 3: Deploy to Netlify

### Option 1: Deploy via Netlify CLI

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
   netlify env:set JWT_SECRET "your_secure_jwt_secret"
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

## Step 4: Test Your Deployment

1. **Wait for the deployment to complete**

2. **Test your application:**
   - Visit your Netlify site URL
   - Test user registration and login
   - Test core application features
   - Check for any errors in the Netlify function logs

## Troubleshooting

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

### Frontend Issues

1. **Check browser console for errors**

2. **Verify API endpoints:**
   - Make sure your frontend is using the correct API endpoints
   - Check that the redirects in `netlify.toml` are set up correctly

3. **Rebuild and redeploy:**
   ```bash
   netlify deploy --prod
   ```

## Scaling Considerations

As your application grows, consider the following:

1. **MongoDB Atlas scaling:**
   - Upgrade to a paid tier for better performance and storage
   - Set up database indexing for frequently queried fields

2. **Netlify scaling:**
   - Monitor function execution time and memory usage
   - Consider splitting large functions into smaller ones
   - Use Netlify's edge functions for better performance

3. **Performance optimization:**
   - Implement caching strategies
   - Optimize database queries
   - Use CDN for static assets

## Maintenance

1. **Regular backups:**
   - Set up automated backups in MongoDB Atlas

2. **Monitoring:**
   - Set up monitoring for your application
   - Configure alerts for critical issues

3. **Updates:**
   - Regularly update dependencies
   - Test updates in a staging environment before deploying to production
