# Troubleshooting Backend Connection Issues on Vercel

## 🚨 FUNCTION_INVOCATION_FAILED (500 Error)

If you're seeing `500: INTERNAL_SERVER_ERROR` with `Code: FUNCTION_INVOCATION_FAILED`, this usually means:

1. **Module Import Error** - The serverless function can't import the backend code
2. **Missing Dependencies** - Required packages aren't installed
3. **Path Resolution Issue** - Import paths don't resolve correctly
4. **MongoDB Connection Error** - Database connection fails at startup

### Quick Fixes:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `/api/index.js`
   - Check the "Logs" tab for the actual error message
   - Look for import errors, missing modules, or MongoDB connection errors

2. **Verify File Structure:**
   - Ensure `backend/server.js` exists
   - Ensure `api/index.js` exists
   - Check that all backend routes, models, and middleware exist

3. **Check Environment Variables:**
   - `MONGODB_URI` must be set
   - Connection string must be valid
   - No extra spaces or quotes

4. **Redeploy:**
   - Push latest code to GitHub
   - Trigger a new deployment
   - Check build logs for errors

## Common Issues and Solutions

### 1. Backend Not Connected / API Not Working

#### Check Environment Variables
Make sure all required environment variables are set in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these are set:
   - ✅ `MONGODB_URI` - Your MongoDB Atlas connection string
   - ✅ `JWT_SECRET` - Secret key (min 32 characters)
   - ✅ `JWT_EXPIRE=7d`
   - ✅ `NODE_ENV=production`
   - ✅ `FRONTEND_URL` - Your Vercel URL (e.g., `https://your-app.vercel.app`)

#### Test API Endpoints

1. **Health Check:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"Portfolio API is running"}`

2. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `/api/index.js`
   - Check the "Logs" tab for errors

#### Common Errors:

**Error: "MongoServerError: bad auth"**
- ❌ Wrong MongoDB credentials
- ✅ Check your MongoDB Atlas username and password
- ✅ Make sure password is URL-encoded in connection string

**Error: "MongooseServerSelectionError"**
- ❌ MongoDB IP whitelist issue
- ✅ Go to MongoDB Atlas → Network Access
- ✅ Add `0.0.0.0/0` to allow all IPs (or Vercel's IPs)

**Error: "Cannot find module"**
- ❌ Missing dependencies
- ✅ Check that `api/package.json` has all required dependencies
- ✅ Redeploy after adding dependencies

**Error: 404 on API routes**
- ❌ Routing issue
- ✅ Check `vercel.json` configuration
- ✅ Verify API routes are accessible at `/api/*`

### 2. MongoDB Connection Issues

#### Test MongoDB Connection String

Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority
```

**Important:**
- Replace `<password>` with your actual password
- URL-encode special characters in password
- Include the database name (`portfolio_db`)

#### Check MongoDB Atlas Settings

1. **Network Access:**
   - MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs)
   - Or add Vercel's IP ranges

2. **Database User:**
   - MongoDB Atlas → Database Access
   - Verify user has read/write permissions
   - Check username and password are correct

### 3. CORS Errors

If you see CORS errors in browser console:

1. **Check FRONTEND_URL:**
   - Must match your exact Vercel URL
   - Include `https://` protocol
   - No trailing slash

2. **Update CORS in backend:**
   - The backend should auto-detect Vercel URL
   - If not, manually add your URL to allowed origins

### 4. Frontend Can't Connect to Backend

#### Check Frontend API Configuration

1. **In Production (Vercel):**
   - Frontend should use `/api` (relative path)
   - This is auto-configured in `frontend/src/utils/api.js`

2. **Verify API URL:**
   - Open browser DevTools → Network tab
   - Check API requests are going to `/api/*`
   - Should NOT be going to `localhost:5000`

#### Test API from Browser Console

```javascript
// Test health endpoint
fetch('/api/health')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

### 5. Function Timeout

Vercel free tier has 10-second timeout for serverless functions.

**Solutions:**
- Optimize database queries
- Use connection pooling (already implemented)
- Consider upgrading to Pro plan for longer timeouts

### 6. Build Errors

#### Check Build Logs

1. Go to Vercel Dashboard → Deployments
2. Click on failed deployment
3. Check build logs for errors

#### Common Build Issues:

**"Module not found"**
- ❌ Missing dependencies in `api/package.json`
- ✅ Add missing packages to `api/package.json`
- ✅ Redeploy

**"Cannot find module '../backend/server.js'"**
- ❌ Path issue
- ✅ Verify file structure is correct
- ✅ Check that `backend/server.js` exists

### 7. Debugging Steps

1. **Check Vercel Function Logs:**
   ```
   Vercel Dashboard → Project → Functions → /api/index.js → Logs
   ```

2. **Test API Directly:**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

3. **Check Environment Variables:**
   - Verify all variables are set
   - Check for typos
   - Ensure no extra spaces

4. **Test MongoDB Connection:**
   - Use MongoDB Compass or `mongosh` to test connection string
   - Verify database and collections exist

5. **Check Network Tab:**
   - Open browser DevTools
   - Go to Network tab
   - Check API requests and responses
   - Look for error status codes

### 8. Quick Fixes

**Redeploy:**
- Sometimes a simple redeploy fixes issues
- Vercel Dashboard → Deployments → Redeploy

**Clear Cache:**
- Vercel caches some responses
- Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Check Function Status:**
- Vercel Dashboard → Functions
- Verify `/api/index.js` is deployed and active

## Still Having Issues?

1. **Check Vercel Status:** [vercel-status.com](https://www.vercel-status.com)
2. **Check MongoDB Atlas Status:** [status.mongodb.com](https://status.mongodb.com)
3. **Review Vercel Logs:** Detailed error messages in function logs
4. **Test Locally First:** Make sure everything works locally before deploying

## Useful Commands

```bash
# Test API health endpoint
curl https://your-app.vercel.app/api/health

# Test with authentication
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```
