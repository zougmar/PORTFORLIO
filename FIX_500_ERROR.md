# Fix: FUNCTION_INVOCATION_FAILED (500 Error)

## What This Error Means

The serverless function is crashing when it tries to execute. Common causes:

1. **Import/Module Error** - Can't import backend code
2. **Missing Dependencies** - Packages not installed
3. **MongoDB Connection** - Fails at module load
4. **Path Resolution** - Import paths don't work in Vercel

## Step-by-Step Fix

### Step 1: Check Vercel Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **Functions** tab
3. Click on **`/api/index.js`**
4. Open **Logs** tab
5. Look for the actual error message

**Common error messages you might see:**

- `Cannot find module '../backend/server.js'` → Path issue
- `Cannot find module 'express'` → Missing dependencies
- `MongoServerSelectionError` → MongoDB connection issue
- `SyntaxError` → Code syntax issue

### Step 2: Verify Environment Variables

In Vercel Dashboard → Settings → Environment Variables, ensure:

```
✅ MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
✅ JWT_SECRET=your_secret_key_min_32_chars
✅ JWT_EXPIRE=7d
✅ NODE_ENV=production
✅ FRONTEND_URL=https://your-app.vercel.app
```

**Important:**
- No quotes around values
- No spaces before/after `=`
- MongoDB password must be URL-encoded if it has special characters

### Step 3: Check MongoDB Connection

1. **Test connection string:**
   ```bash
   # Use MongoDB Compass or mongosh to test
   mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
   ```

2. **Check MongoDB Atlas:**
   - Network Access → Add `0.0.0.0/0` (allows all IPs)
   - Database Access → Verify user has read/write permissions
   - Verify username and password are correct

### Step 4: Verify File Structure

Your project should have:
```
├── api/
│   ├── index.js          ✅ Must exist
│   └── package.json      ✅ Must exist
├── backend/
│   ├── server.js         ✅ Must exist
│   ├── routes/           ✅ Must exist
│   ├── models/           ✅ Must exist
│   └── middleware/       ✅ Must exist
└── vercel.json           ✅ Must exist
```

### Step 5: Test Import Locally

Before deploying, test if imports work:

```bash
# In your project root
node -e "import('./api/index.js').then(m => console.log('✅ Import works')).catch(e => console.error('❌ Import failed:', e))"
```

### Step 6: Common Fixes

#### Fix 1: Missing Dependencies

If you see `Cannot find module 'X'`:

1. Add missing package to `api/package.json`:
   ```json
   {
     "dependencies": {
       "express": "^4.18.2",
       "mongoose": "^8.0.3",
       // ... all other dependencies
     }
   }
   ```

2. Redeploy

#### Fix 2: Path Resolution Issue

If you see `Cannot find module '../backend/server.js'`:

1. Verify `backend/server.js` exists
2. Check that file structure is correct
3. Ensure code is pushed to GitHub
4. Redeploy

#### Fix 3: MongoDB Connection at Module Load

If MongoDB connection fails when importing:

The code has been updated to connect on-demand in serverless mode. Make sure:
- `MONGODB_URI` is set correctly
- MongoDB Atlas allows connections from Vercel IPs
- Connection string format is correct

#### Fix 4: ES Module Issues

If you see syntax errors:

1. Ensure `api/package.json` has `"type": "module"`
2. Ensure `backend/server.js` uses ES6 imports (`import` not `require`)
3. Check all files use `.js` extension (not `.cjs`)

### Step 7: Test After Fix

1. **Test health endpoint:**
   ```
   https://your-app.vercel.app/api/health
   ```

2. **Check function logs again:**
   - Should see: `✅ Express app imported successfully`
   - Should see: `[API] GET /api/health`

3. **If still failing:**
   - Check logs for new error messages
   - Verify all environment variables
   - Test MongoDB connection separately

## Still Not Working?

### Debug Mode

Add this to see more details:

1. Set `NODE_ENV=development` in Vercel environment variables
2. Redeploy
3. Check logs - you'll see more detailed error messages

### Alternative: Use Test Endpoint

Test if Vercel functions work at all:

1. Visit: `https://your-app.vercel.app/api/test`
2. Should return JSON response
3. If this works but `/api/index.js` doesn't, it's an import issue

### Get Help

1. **Check Vercel Logs** - Most detailed error info
2. **Check MongoDB Atlas Logs** - Connection attempts
3. **Test Locally First** - Make sure it works locally
4. **Review Error Stack** - Look for the first error in the stack trace

## Quick Checklist

- [ ] All environment variables set in Vercel
- [ ] MongoDB connection string is valid and tested
- [ ] MongoDB Atlas allows `0.0.0.0/0` IPs
- [ ] All files exist (`api/index.js`, `backend/server.js`)
- [ ] `api/package.json` has all dependencies
- [ ] Code is pushed to GitHub
- [ ] Redeployed on Vercel
- [ ] Checked function logs for actual error
- [ ] Tested `/api/health` endpoint
