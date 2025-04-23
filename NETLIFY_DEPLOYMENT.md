# Netlify Deployment Guide

This guide provides instructions for deploying the Roadside Assistance application to Netlify.

## Prerequisites

- A Netlify account
- Git repository with your code
- MongoDB Atlas account (for the database)

## Step 1: Set Up Environment Variables

Before deploying, you need to set up the following environment variables in Netlify:

1. **MONGODB_URI**: Your MongoDB Atlas connection string
   - Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
   - Example: `mongodb+srv://softeng:softeng123@cluster0.j8hvx.mongodb.net/roadside-assistance?retryWrites=true&w=majority`

2. **JWT_SECRET**: A secure random string for JWT token generation
   - Example: `mysupersecretkey123456789`

## Step 2: Deploy to Netlify

### Option 1: Deploy via Netlify UI (GitHub Integration)

1. Push your code to GitHub
2. Log in to Netlify
3. Click "New site from Git"
4. Select GitHub and authorize Netlify
5. Select your repository
6. Configure build settings:
   - Build command: `chmod +x build-no-check.sh && ./build-no-check.sh`
   - Publish directory: `dist`
7. Click "Show advanced" and add the environment variables from Step 1
8. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify site:
   ```bash
   netlify init
   ```
   - Select "Create & configure a new site"
   - Follow the prompts to set up your site

4. Set environment variables:
   ```bash
   netlify env:set MONGODB_URI "your_mongodb_atlas_connection_string"
   netlify env:set JWT_SECRET "your_secure_jwt_secret"
   ```

5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Verify Deployment

After deployment, verify that:

1. The frontend is accessible at your Netlify URL
2. The API endpoints are working correctly
3. The MongoDB connection is established

You can check the Netlify function logs to verify the MongoDB connection:

1. Go to Netlify dashboard > Your site > Functions
2. Click on the "api" function
3. Check the logs for any connection errors

## Troubleshooting

If you encounter issues with the deployment:

1. **Build Failures**:
   - Check the build logs in Netlify
   - Ensure all dependencies are correctly installed
   - Verify that the build script is executable

2. **API Connection Issues**:
   - Verify that the environment variables are correctly set
   - Check that the MongoDB Atlas IP whitelist includes Netlify's IPs
   - Test the API endpoints using the Netlify function URL

3. **MongoDB Connection Issues**:
   - Verify that the MongoDB URI is correct
   - Ensure that the MongoDB Atlas cluster is running
   - Check that the database user has the correct permissions

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
