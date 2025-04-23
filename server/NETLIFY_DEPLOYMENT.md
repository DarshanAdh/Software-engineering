# Deploying to Netlify

This guide explains how to deploy the Roadside Assistance API to Netlify.

## Prerequisites

1. A Netlify account
2. Git repository with your code

## Environment Variables

Make sure to set the following environment variables in Netlify:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `NODE_ENV`: Set to "production"

## Deployment Steps

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git provider and select your repository
4. Configure the build settings:
   - Build command: `cd server && npm install`
   - Publish directory: `server`
5. Click "Show advanced" and add the environment variables mentioned above
6. Click "Deploy site"

## Verifying Deployment

After deployment, your API will be available at:
`https://your-netlify-site-name.netlify.app/.netlify/functions/api`

You can test it by visiting:
`https://your-netlify-site-name.netlify.app/.netlify/functions/api`

## Troubleshooting

If you encounter issues:

1. Check Netlify's function logs in the Netlify dashboard
2. Verify that all environment variables are set correctly
3. Make sure your MongoDB Atlas IP whitelist allows connections from Netlify

## Frontend Configuration

Update your frontend application to use the new API URL:
`https://your-netlify-site-name.netlify.app/.netlify/functions/api`

For example, if your frontend makes requests to `/api/auth/login`, it should now make requests to `https://your-netlify-site-name.netlify.app/.netlify/functions/api/auth/login`
