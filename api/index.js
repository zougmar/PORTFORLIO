// Vercel serverless function wrapper for Express app
// Set Vercel environment flag before any imports
process.env.VERCEL = '1';

// Import the Express app
import appModule from '../backend/server.js';
const app = appModule.default || appModule;

// Vercel serverless function handler
export default async function handler(req, res) {
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
