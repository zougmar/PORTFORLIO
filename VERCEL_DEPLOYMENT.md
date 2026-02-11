# Vercel Deployment Guide - Full Stack (Frontend + Backend)

This guide will help you deploy both your frontend and backend on Vercel.

## 📋 Prerequisites

1. GitHub account with your code pushed to a repository
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. MongoDB Atlas account (for database) - [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

## 🚀 Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (add `0.0.0.0/0` to allow all IPs, or Vercel's IPs)
5. Get your connection string (replace `<password>` with your password)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority`

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**
   - Select your portfolio repository
   - Click "Import"

4. **Configure Project Settings:**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: Leave as root (`.`)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

5. **Add Environment Variables:**
   
   Click "Environment Variables" and add:
   
   **For Backend (API):**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```
   
   **For Frontend (Optional - only if you want to override):**
   ```
   VITE_API_URL=/api
   ```
   (Note: The frontend will automatically use `/api` in production, so this is optional)

6. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete

### Step 3: Update Environment Variables After First Deploy

After the first deployment, Vercel will give you a URL like `https://your-app.vercel.app`

1. Go to your project settings → Environment Variables
2. Update `FRONTEND_URL` to your actual Vercel URL: `https://your-app.vercel.app`
3. Redeploy (Vercel will auto-redeploy when you update env vars)

## 📁 Project Structure

Your project is now configured with:
- **Frontend**: Built from `frontend/` directory → served as static files
- **Backend API**: Serverless functions in `api/` directory → accessible at `/api/*`

## 🔗 API Endpoints

After deployment, your API will be available at:
- `https://your-app.vercel.app/api/auth/*`
- `https://your-app.vercel.app/api/projects/*`
- `https://your-app.vercel.app/api/skills/*`
- `https://your-app.vercel.app/api/messages/*`
- `https://your-app.vercel.app/api/users/*`
- `https://your-app.vercel.app/api/settings/*`
- `https://your-app.vercel.app/api/health` (health check)

## ⚠️ Important Notes

### File Uploads Limitation

**Current Issue**: Vercel serverless functions have a read-only filesystem. File uploads (CVs, project images) won't work with the current setup.

**Solutions:**

1. **Use Vercel Blob Storage** (Recommended)
   - Install: `@vercel/blob`
   - Update upload middleware to use Blob storage
   - See: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)

2. **Use Cloudinary** (Alternative)
   - Free tier available
   - Good for images
   - See: [cloudinary.com](https://cloudinary.com)

3. **Use AWS S3** (Production)
   - More robust for production
   - Requires AWS account

**For now**: File upload features will need to be updated to use cloud storage. The rest of the API will work fine.

### MongoDB Connection

The backend is configured to cache MongoDB connections for serverless functions, which is important for performance.

### CORS

CORS is configured to allow requests from your Vercel frontend URL automatically.

## 🧪 Testing Your Deployment

1. **Test Frontend:**
   - Visit: `https://your-app.vercel.app`
   - Should load your portfolio

2. **Test API:**
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"OK","message":"Portfolio API is running"}`

3. **Test Authentication:**
   - Try registering a user at `/register`
   - Try logging in at `/login`

## 🔄 Updating Your Deployment

- **Automatic**: Every push to your main branch will trigger a new deployment
- **Manual**: Go to Vercel dashboard → Deployments → Redeploy

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Check build logs in Vercel dashboard
- Ensure MongoDB connection string is correct

### API Returns 500 Errors
- Check Vercel function logs
- Verify all environment variables are set
- Check MongoDB connection string

### CORS Errors
- Ensure `FRONTEND_URL` matches your Vercel URL exactly
- Check that CORS middleware is configured correctly

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check MongoDB connection string format
- Verify database user credentials

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | ✅ Yes |
| `JWT_EXPIRE` | JWT token expiration (e.g., "7d") | ✅ Yes |
| `NODE_ENV` | Environment (production/development) | ✅ Yes |
| `FRONTEND_URL` | Your Vercel frontend URL | ✅ Yes |
| `EMAIL_HOST` | SMTP server host | Optional |
| `EMAIL_PORT` | SMTP server port | Optional |
| `EMAIL_USER` | Email address for sending emails | Optional |
| `EMAIL_PASS` | Email app password | Optional |
| `VITE_API_URL` | Frontend API URL (auto-detected) | Optional |

## 🎉 Success!

Once deployed, your portfolio will be live at `https://your-app.vercel.app`!

Both frontend and backend are now running on Vercel as a single deployment.
