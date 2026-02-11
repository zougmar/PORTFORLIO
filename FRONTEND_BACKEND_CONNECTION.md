# Frontend-Backend Connection Guide

## ✅ What's Fixed

1. **AuthContext** - Now uses the shared `api` utility instead of hardcoded URLs
2. **AdminDashboard** - All API calls now use the `api` utility
3. **Home.jsx** - Image URLs use relative paths
4. **Projects.jsx** - Image URLs use relative paths
5. **API Utility** - Automatically uses `/api` in production (same domain)

## 🔍 How It Works

### In Production (Vercel):
- Frontend URL: `https://portforlio-lilac.vercel.app`
- Backend API: `https://portforlio-lilac.vercel.app/api/*`
- Frontend uses relative path `/api` → automatically resolves to same domain

### In Development:
- Frontend: `http://localhost:3000` or `http://localhost:5173`
- Backend: `http://localhost:5000/api`
- Uses `VITE_API_URL` or defaults to `http://localhost:5000/api`

## 🧪 Testing the Connection

### 1. Check Browser Console
Open your deployed site and check the browser console (F12):
- Look for network requests to `/api/*`
- Check for CORS errors
- Check for 404 or 500 errors

### 2. Test API Calls
Open browser console and run:
```javascript
// Test projects endpoint
fetch('/api/projects')
  .then(res => res.json())
  .then(data => console.log('Projects:', data))
  .catch(err => console.error('Error:', err));

// Test skills endpoint
fetch('/api/skills')
  .then(res => res.json())
  .then(data => console.log('Skills:', data))
  .catch(err => console.error('Error:', err));
```

### 3. Check Network Tab
1. Open DevTools → Network tab
2. Reload the page
3. Look for requests to `/api/*`
4. Check their status:
   - ✅ 200 = Success
   - ❌ 404 = Route not found
   - ❌ 500 = Server error
   - ❌ CORS error = CORS configuration issue

## 🔧 Troubleshooting

### Issue: Frontend can't fetch data

**Check 1: API URL**
- Open browser console
- Check what URL is being used
- Should be `/api` in production, not `http://localhost:5000/api`

**Check 2: CORS Errors**
- If you see CORS errors in console
- Check `FRONTEND_URL` in Vercel environment variables
- Should match your Vercel URL exactly: `https://portforlio-lilac.vercel.app`

**Check 3: Network Requests**
- Check Network tab in DevTools
- See if requests are going to `/api/*`
- Check response status and error messages

### Issue: 404 on API routes

**Possible causes:**
1. Vercel routing not configured correctly
2. API function not deployed
3. Wrong URL path

**Fix:**
- Check `vercel.json` configuration
- Verify API function exists in Vercel dashboard
- Test API directly: `https://your-app.vercel.app/api/health`

### Issue: 500 errors

**Check Vercel logs:**
- Functions → `/api/index.js` → Logs
- Look for MongoDB connection errors
- Look for other server errors

## 📝 Quick Checklist

- [ ] Frontend is deployed on Vercel
- [ ] Backend API is working (test `/api/health`)
- [ ] `FRONTEND_URL` is set in Vercel to your frontend URL
- [ ] No CORS errors in browser console
- [ ] Network requests show `/api/*` (not localhost)
- [ ] API responses return 200 status

## 🎯 Expected Behavior

**When Connected:**
- Frontend loads data from API
- Projects, skills, settings all load
- No errors in browser console
- Network tab shows successful `/api/*` requests

**When NOT Connected:**
- Frontend shows empty data or loading forever
- Console shows network errors
- Network tab shows failed requests
- CORS errors in console

## 💡 Debug Steps

1. **Open your deployed site**
2. **Open DevTools (F12)**
3. **Go to Console tab** - Look for errors
4. **Go to Network tab** - Check API requests
5. **Test API directly** - Visit `/api/projects` in browser
6. **Check Vercel logs** - Functions → Logs

---

**Your API is working at:** `https://portforlio-lilac.vercel.app/api/projects`

If the frontend still can't connect, check the browser console for specific error messages!
