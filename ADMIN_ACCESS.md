# How to Access Admin Dashboard

## Step-by-Step Guide

### Option 1: Register a New Admin Account (Recommended for First Time)

1. **Start your servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:3000/register
   ```

3. **Fill in the registration form:**
   - **Username**: Choose a username (minimum 3 characters)
   - **Email**: Your email address (e.g., o.zouglah03@gmail.com)
   - **Password**: Choose a strong password (minimum 6 characters)

4. **Click "Sign Up"**

   ⚠️ **Important**: The **first user** you register will automatically be assigned the **admin role**.

5. **After registration**, you'll be automatically logged in and redirected to the admin dashboard at:
   ```
   http://localhost:3000/admin
   ```

### Option 2: Login to Existing Account

If you already have an account:

1. Navigate to:
   ```
   http://localhost:3000/login
   ```

2. Enter your credentials:
   - **Email**: The email you used to register
   - **Password**: Your password

3. Click "Sign In"

4. If you have admin role, you'll see an "Admin" button in the navbar, or go directly to:
   ```
   http://localhost:3000/admin
   ```

## Admin Dashboard Features

Once logged in as admin, you can:

- ✅ **Manage Projects**: Add, edit, and delete projects
- ✅ **Manage Skills**: Add, edit, and delete skills
- ✅ **View Messages**: See all contact form messages from visitors
- ✅ **Full CRUD Operations**: Complete control over portfolio content

## Troubleshooting

### "Access denied. Admin only."
- You're logged in but don't have admin role
- Solution: Register a new account (first user gets admin automatically)

### "Invalid credentials"
- Check your email and password
- Make sure you're using the correct email you registered with

### Can't access `/admin` route
- Make sure you're logged in
- Check if your user has `role: 'admin'` in the database
- First registered user automatically gets admin role

### Check User Role in Database

If you need to manually check or update a user's role in MongoDB:

```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Quick Test

1. Register at: `http://localhost:3000/register`
2. Login at: `http://localhost:3000/login`
3. Access admin at: `http://localhost:3000/admin`

The first user registered will automatically be an admin! 🎉
