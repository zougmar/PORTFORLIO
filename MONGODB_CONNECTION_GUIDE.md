# MongoDB Connection Guide for Vercel

## ✅ Step 1: Verify MONGODB_URI in Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in and select your project

2. **Check Environment Variables**
   - Go to: **Settings** → **Environment Variables**
   - Look for: `MONGODB_URI`
   - **It MUST be set!**

3. **Verify the Connection String Format**
   Your `MONGODB_URI` should look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority
   ```
   
   **Important:**
   - Replace `username` with your MongoDB Atlas username
   - Replace `password` with your MongoDB Atlas password (URL-encoded if it has special characters)
   - Replace `cluster.mongodb.net` with your actual cluster URL
   - Replace `portfolio_db` with your database name

## ✅ Step 2: Check MongoDB Atlas Settings

### Network Access
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
   - Or add Vercel's IP ranges if you prefer

### Database Access
1. Click **Database Access** (left sidebar)
2. Verify your database user exists
3. Check that the user has **Read and write** permissions
4. Verify username and password match what's in your connection string

## ✅ Step 3: Test the Connection

### Test 1: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → **Functions**
2. Click on `/api/index.js`
3. Go to **Logs** tab
4. Make a request to your API (e.g., visit `/api/health`)
5. Look for:
   - ✅ `✅ Connected to MongoDB` - Connection successful!
   - ❌ `❌ MongoDB connection error` - Connection failed (check error message)

### Test 2: Test API Endpoint
Visit: `https://your-app.vercel.app/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Portfolio API is running"
}
```

If you get an error, check the logs for MongoDB connection issues.

### Test 3: Test Database Query
Visit: `https://your-app.vercel.app/api/projects`

**Expected Response:**
- If connected: Array of projects (or empty array `[]`)
- If not connected: Error message about MongoDB

## 🔧 Common Issues and Fixes

### Issue 1: "MongoServerError: bad auth"
**Problem:** Wrong username or password

**Fix:**
1. Check MongoDB Atlas → Database Access
2. Verify username and password
3. Update `MONGODB_URI` in Vercel with correct credentials
4. **Important:** URL-encode special characters in password
   - Example: If password is `p@ss#word`, use `p%40ss%23word`

### Issue 2: "MongooseServerSelectionError"
**Problem:** IP address not whitelisted

**Fix:**
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` (allows all IPs)
3. Wait 1-2 minutes for changes to propagate
4. Try again

### Issue 3: "MONGODB_URI is undefined"
**Problem:** Environment variable not set in Vercel

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Add `MONGODB_URI` with your connection string
3. **Important:** 
   - No quotes around the value
   - No spaces before/after `=`
   - Value should start with `mongodb+srv://` or `mongodb://`
4. Redeploy your project

### Issue 4: Connection String Format Wrong
**Problem:** Malformed connection string

**Correct Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**Common Mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Missing `@` before cluster name
- ❌ Missing database name
- ❌ Extra spaces or quotes

## 📝 Quick Checklist

- [ ] `MONGODB_URI` is set in Vercel environment variables
- [ ] Connection string format is correct
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] Database user has read/write permissions
- [ ] Username and password are correct
- [ ] Password is URL-encoded if it has special characters
- [ ] Project has been redeployed after setting environment variables
- [ ] Checked Vercel logs for connection errors

## 🧪 Test Your Connection

### Using curl:
```bash
curl https://your-app.vercel.app/api/health
```

### Using Browser:
Visit: `https://your-app.vercel.app/api/health`

### Check Logs:
1. Vercel Dashboard → Functions → `/api/index.js` → Logs
2. Look for MongoDB connection messages

## 🎯 Expected Behavior

**When Connected:**
- API endpoints return data (or empty arrays)
- Logs show: `✅ Connected to MongoDB`
- No MongoDB errors in logs

**When NOT Connected:**
- API endpoints return 500 errors
- Logs show: `❌ MongoDB connection error`
- Error messages mention MongoDB

## 💡 Pro Tips

1. **Test Locally First**
   - Make sure MongoDB connection works locally
   - Use the same connection string format

2. **Use MongoDB Compass**
   - Download [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Test your connection string locally
   - If it works in Compass, it should work in Vercel

3. **Check Vercel Logs Regularly**
   - Connection errors are logged clearly
   - Look for the exact error message
   - It will tell you what's wrong

4. **Wait After Changes**
   - After updating Network Access in MongoDB Atlas, wait 1-2 minutes
   - After updating environment variables in Vercel, redeploy

## 🆘 Still Having Issues?

1. **Check Vercel Logs** - Most detailed error info
2. **Verify Connection String** - Use MongoDB Compass to test
3. **Check MongoDB Atlas Status** - [status.mongodb.com](https://status.mongodb.com)
4. **Verify Environment Variables** - Make sure they're set correctly
5. **Redeploy** - Sometimes a fresh deployment helps

---

**Remember:** The connection string format is critical. Double-check every character!
