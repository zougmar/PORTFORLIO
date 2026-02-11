# Quick Start: Deploy to Vercel

## ✅ What's Been Set Up

Your project is now configured to deploy both frontend and backend on Vercel:

1. ✅ **API Serverless Function** - Created at `api/index.js`
2. ✅ **MongoDB Connection** - Optimized for serverless (connection caching)
3. ✅ **Vercel Configuration** - `vercel.json` configured for monorepo
4. ✅ **Frontend API URL** - Auto-detects Vercel environment
5. ✅ **CORS** - Configured to work with Vercel URLs

## 🚀 Deploy in 3 Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"**
3. Import your repository
4. **Configure:**
   - Framework: **Vite** (auto-detected)
   - Root Directory: **.** (root)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Note:** After first deploy, update `FRONTEND_URL` with your actual Vercel URL.

## 📍 Your URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/*`
- **Health Check**: `https://your-app.vercel.app/api/health`

## ⚠️ File Uploads

File uploads (CVs, project images) need cloud storage. Current setup uses local filesystem which doesn't work on Vercel serverless.

**Quick Fix Options:**
- Use Vercel Blob Storage
- Use Cloudinary (free tier)
- Use AWS S3

See `VERCEL_DEPLOYMENT.md` for details.

## 🎉 Done!

Your portfolio is now live on Vercel with both frontend and backend!
