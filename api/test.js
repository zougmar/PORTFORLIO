// Simple test endpoint to verify Vercel is working
export default function handler(req, res) {
  return res.status(200).json({
    status: 'OK',
    message: 'API test endpoint is working',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      hasMongoURI: !!process.env.MONGODB_URI
    }
  });
}
