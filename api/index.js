// Vercel serverless function wrapper for Express app
// Set Vercel environment flag before any imports
process.env.VERCEL = '1';

// Lazy load the Express app to handle module resolution
let appPromise = null;

async function getApp() {
  if (appPromise) return appPromise;
  
  appPromise = (async () => {
    // Try local backend copy first (created by prepare-vercel script)
    try {
      const appModule = await import('./backend/server.js');
      console.log('✅ Express app loaded from api/backend/server.js');
      return appModule.default || appModule;
    } catch (error) {
      console.log('⚠️ Local backend not found, using root backend');
      // Fallback to root backend
      const appModule = await import('../backend/server.js');
      return appModule.default || appModule;
    }
  })();
  
  return appPromise;
}

// Vercel serverless function handler
export default async function handler(req, res) {
  // Get the Express app (lazy loaded)
  const app = await getApp();
  // Log request for debugging
  console.log(`[API] ${req.method} ${req.url}`);
  
  // Log environment info (without sensitive data)
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    hasMongoURI: !!process.env.MONGODB_URI,
    hasJWTSecret: !!process.env.JWT_SECRET,
    appType: typeof app
  });
  
  try {
    // Ensure MongoDB is connected (for serverless)
    if (process.env.VERCEL === '1') {
      // Import and call connectDB if needed
      const mongoose = await import('mongoose');
      if (mongoose.connection.readyState === 0) {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
          bufferCommands: false,
        });
        console.log('✅ MongoDB connected');
      }
    }
    
    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    console.error('API Handler Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // If response hasn't been sent, send error
    if (!res.headersSent) {
      return res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred',
        type: error.name || 'UnknownError',
        code: error.code || undefined
      });
    }
  }
}
