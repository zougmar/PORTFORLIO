// Vercel serverless function wrapper for Express app
import app from '../backend/server.js';

// Vercel serverless function handler
export default function handler(req, res) {
  // Set Vercel environment flag
  if (!process.env.VERCEL) {
    process.env.VERCEL = '1';
  }
  
  // Handle the request with Express
  return app(req, res);
}
