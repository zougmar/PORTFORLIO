# How to View Errors in Vercel

## Method 1: View Function Logs (Recommended)

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Select Your Project**
   - Click on your portfolio project

3. **Go to Functions Tab**
   - Click on the **"Functions"** tab in the top menu
   - Or go to: `https://vercel.com/[your-username]/[your-project]/functions`

4. **Select the API Function**
   - Find and click on **`/api/index.js`** in the list
   - This is your serverless function

5. **View Logs**
   - Click on the **"Logs"** tab
   - You'll see all console.log outputs and errors
   - Errors will be highlighted in red

### What to Look For:

- **Red error messages** - These are the actual errors
- **Stack traces** - Shows where the error occurred
- **Console logs** - Look for messages starting with `[API]` or `❌`
- **Import errors** - "Cannot find module" messages
- **MongoDB errors** - Connection or authentication errors

---

## Method 2: View Deployment Logs

### Step-by-Step:

1. **Go to Deployments**
   - In your Vercel project, click **"Deployments"** tab
   - Click on the latest deployment (top of the list)

2. **View Build Logs**
   - Scroll down to see build logs
   - Look for errors during the build process

3. **View Runtime Logs**
   - Click on **"Functions"** section
   - Click on **`/api/index.js`**
   - View runtime errors here

---

## Method 3: Real-Time Logs (During Testing)

### Step-by-Step:

1. **Open Your Deployed Site**
   - Visit: `https://your-app.vercel.app`

2. **Trigger an API Call**
   - Try to access: `https://your-app.vercel.app/api/health`
   - Or use your frontend to trigger API calls

3. **Immediately Check Logs**
   - Go back to Vercel Dashboard
   - Functions → `/api/index.js` → Logs
   - You'll see the request and any errors in real-time

---

## Method 4: Browser Developer Tools

### For Frontend Errors:

1. **Open Browser DevTools**
   - Press `F12` or `Right-click → Inspect`
   - Go to **"Console"** tab

2. **Check Network Tab**
   - Go to **"Network"** tab
   - Look for failed requests (red)
   - Click on failed requests to see error details

3. **Check Response**
   - Click on the API request
   - Go to **"Response"** tab
   - See the error message returned by the API

---

## Understanding Error Messages

### Common Error Types:

#### 1. **Import/Module Errors**
```
Error: Cannot find module '../backend/server.js'
```
**Meaning:** The file path is wrong or file doesn't exist
**Fix:** Check file structure and paths

#### 2. **MongoDB Connection Errors**
```
MongooseServerSelectionError: connect ECONNREFUSED
```
**Meaning:** Can't connect to MongoDB
**Fix:** Check `MONGODB_URI` and MongoDB Atlas settings

#### 3. **Authentication Errors**
```
MongoServerError: bad auth
```
**Meaning:** Wrong MongoDB username/password
**Fix:** Verify credentials in connection string

#### 4. **Missing Environment Variables**
```
process.env.MONGODB_URI is undefined
```
**Meaning:** Environment variable not set
**Fix:** Add variable in Vercel settings

#### 5. **Dependency Errors**
```
Error: Cannot find module 'express'
```
**Meaning:** Package not installed
**Fix:** Add to `api/package.json` and redeploy

---

## Quick Access Links

### Direct Links (Replace with your details):

- **Functions:** `https://vercel.com/[username]/[project]/functions`
- **Deployments:** `https://vercel.com/[username]/[project]/deployments`
- **Settings:** `https://vercel.com/[username]/[project]/settings`
- **Environment Variables:** `https://vercel.com/[username]/[project]/settings/environment-variables`

---

## Pro Tips

1. **Filter Logs**
   - Use the search box in logs to filter by error type
   - Search for "Error", "Failed", "❌" to find errors quickly

2. **Copy Error Messages**
   - Click on error messages to copy them
   - Use them to search for solutions

3. **Check Timestamps**
   - Logs show timestamps
   - Match them with when you made requests

4. **Enable Debug Mode**
   - Set `NODE_ENV=development` in environment variables
   - You'll see more detailed error messages
   - **Remember to change back to `production` after debugging!**

5. **Use Test Endpoint**
   - Visit: `https://your-app.vercel.app/api/test`
   - This simple endpoint helps verify Vercel functions work
   - If this works but `/api/health` doesn't, it's a code issue

---

## Screenshot Guide

### Where to Click:

```
Vercel Dashboard
  └── Your Project
      ├── Deployments (see build errors)
      ├── Functions (see runtime errors) ← CLICK HERE
      │   └── /api/index.js ← CLICK HERE
      │       └── Logs Tab ← CLICK HERE FOR ERRORS
      └── Settings
          └── Environment Variables (check if variables are set)
```

---

## Still Can't Find Errors?

1. **Check Vercel Status**
   - Visit: [vercel-status.com](https://www.vercel-status.com)
   - Make sure Vercel is operational

2. **Redeploy**
   - Sometimes a fresh deployment shows errors more clearly
   - Go to Deployments → Click "..." → Redeploy

3. **Check GitHub**
   - Make sure your latest code is pushed
   - Vercel deploys from GitHub

4. **Contact Support**
   - If logs are empty or unclear
   - Vercel Dashboard → Help → Support

---

## Example: What Good Logs Look Like

```
[API] GET /api/health
Environment check: {
  NODE_ENV: 'production',
  VERCEL: '1',
  hasMongoURI: true,
  hasJWTSecret: true
}
✅ Express app imported successfully
✅ Connected to MongoDB
```

## Example: What Error Logs Look Like

```
❌ Failed to import server.js: Error: Cannot find module '../backend/server.js'
Error details: {
  name: 'Error',
  message: 'Cannot find module \'../backend/server.js\'',
  code: 'MODULE_NOT_FOUND'
}
```

---

**Remember:** The most important place to check is **Functions → `/api/index.js` → Logs** tab!
