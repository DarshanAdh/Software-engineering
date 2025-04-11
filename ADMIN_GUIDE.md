# Admin User Guide for Roadside Assistance App

## Creating an Admin User

To create an admin user in the database, follow these steps:

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Run the create-admin script:
   ```
   node scripts/create-admin.js
   ```

3. The script will create an admin user with the following credentials:
   - **Email**: admin123@gmail.com
   - **Password**: admin123
   - **User Type**: admin

   If an admin with this email already exists, the script will notify you.

## Logging in as Admin

1. Go to the login page at `/login`
2. Click on the "Admin" tab in the login form
3. Enter the admin email: `admin123@gmail.com`
4. Enter the admin password: `admin123`
5. Click the "Log In" button
6. You will be redirected to the admin dashboard

## Admin Dashboard Features

Once logged in as an admin, you can:

1. **Approve Helper Applications**:
   - View pending helper applications
   - Approve or reject helpers
   - View helper history

2. **Manage Users**:
   - View all users in the system
   - Delete suspicious users
   - View user history

3. **Monitor Transactions**:
   - View all financial transactions
   - Track payment status
   - Identify suspicious activities

## Security Notes

- The admin account has full access to the system
- Always log out when you're done to protect sensitive information
- For production, use a strong, unique password and enable two-factor authentication
- Admin actions are logged for security purposes

## Troubleshooting

If you encounter issues logging in:
- Make sure you've selected the "Admin" tab
- Check that you've entered the credentials correctly
- Clear your browser cache and try again
- Ensure the backend server is running
- Check MongoDB connection
