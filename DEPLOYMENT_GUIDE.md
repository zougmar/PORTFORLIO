# Deployment Guide

## Backend Deployment

### Step 1: Deploy Backend on Railway/Render/Heroku

Choose one of these platforms:

#### Railway (Recommended - Easiest)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add a new service → "Empty Service"
6. Connect your GitHub repo
7. Set **Root Directory** to `backend`
8. Add environment variables:
   ```
   PORT=5000 (or leave empty, Railway auto-assigns)
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
9. Railway will auto-detect Node.js and deploy
10. **Your backend URL will be shown in the service settings** (e.g., `https://your-app.up.railway.app`)
11. **Your API URL = Backend URL + `/api`** (e.g., `https://your-app.up.railway.app/api`)

#### Render
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `portfolio-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`
6. Add the same environment variables as above
7. Click "Create Web Service"
8. **Your backend URL will be**: `https://your-app.onrender.com`
9. **Your API URL = Backend URL + `/api`** (e.g., `https://your-app.onrender.com/api`)

#### Heroku
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_super_secret_jwt_key
   heroku config:set JWT_EXPIRE=7d
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Deploy: `git push heroku main`
7. **Your backend URL will be**: `https://your-app-name.herokuapp.com`
8. **Your API URL = Backend URL + `/api`** (e.g., `https://your-app-name.herokuapp.com/api`)

### Step 2: Get Your Backend URL

After deploying, you'll get a URL like:
- Railway: `https://your-app.up.railway.app`
- Render: `https://your-app.onrender.com`
- Heroku: `https://your-app-name.herokuapp.com`

**Your Backend API URL = Your Backend URL + `/api`**

Example:
- If your backend URL is: `https://portfolio-backend.up.railway.app`
- Your API URL is: `https://portfolio-backend.up.railway.app/api`

### Step 3: Test Your Backend

Test if your backend is working:
```bash
curl https://your-backend-url.com/api/health
```

You should get: `{"status":"OK","message":"Portfolio API is running"}`

## Frontend Deployment on Vercel

### Step 1: Deploy Frontend

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `frontend` (or leave as root if using vercel.json)
   - **Build Command**: `npm run build` (if root is `frontend`)
   - **Output Directory**: `dist`
6. Add environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.com/api` (use the API URL from Step 2 above!)
7. Click "Deploy"

### Step 2: Update Backend CORS

After getting your Vercel frontend URL, update your backend's `FRONTEND_URL` environment variable:
- Go to your backend hosting platform (Railway/Render/Heroku)
- Update `FRONTEND_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)
- Redeploy if necessary

## Summary

1. **Deploy Backend** → Get backend URL (e.g., `https://backend.up.railway.app`)
2. **Backend API URL** = Backend URL + `/api` (e.g., `https://backend.up.railway.app/api`)
3. **Deploy Frontend on Vercel** → Set `VITE_API_URL` = Your Backend API URL
4. **Update Backend** → Set `FRONTEND_URL` = Your Vercel Frontend URL

## Quick Checklist

- [ ] Backend deployed (Railway/Render/Heroku)
- [ ] Backend URL obtained
- [ ] Backend API URL = Backend URL + `/api`
- [ ] MongoDB Atlas connection string configured
- [ ] All backend environment variables set
- [ ] Frontend deployed on Vercel
- [ ] `VITE_API_URL` set in Vercel to backend API URL
- [ ] `FRONTEND_URL` updated in backend to Vercel URL
- [ ] Test: Visit frontend URL and check if API calls work
