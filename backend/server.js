import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import skillRoutes from './routes/skills.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now, adjust as needed
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// MongoDB connection middleware - ensures DB is connected before handling requests
app.use(async (req, res, next) => {
  // In serverless, ensure connection is established before handling requests
  if (process.env.VERCEL === '1' || process.env.VERCEL_URL) {
    try {
      // Check connection state: 0 = disconnected, 1 = connected, 2 = connecting
      const readyState = mongoose.connection.readyState;
      
      if (readyState === 0) {
        // Not connected, connect now
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('✅ MongoDB connected in middleware');
      } else if (readyState === 2) {
        // Connection in progress, wait for it
        console.log('MongoDB connection in progress, waiting...');
        await new Promise((resolve) => {
          mongoose.connection.once('connected', resolve);
          mongoose.connection.once('error', resolve);
        });
      } else if (readyState === 1) {
        // Already connected
        // Connection is ready
      }
      
      // Double-check connection is ready before proceeding
      if (mongoose.connection.readyState !== 1) {
        console.log('Ensuring MongoDB connection...');
        await connectDB();
      }
    } catch (error) {
      console.error('❌ MongoDB connection error in middleware:', error);
      return res.status(500).json({
        message: 'Database connection error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Unable to connect to database'
      });
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection with caching for serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection exists in cache, return it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (cached.promise) {
    try {
      await cached.promise;
      if (mongoose.connection.readyState === 1) {
        cached.conn = mongoose.connection;
        return cached.conn;
      }
    } catch (e) {
      // Connection failed, reset and try again
      cached.promise = null;
    }
  }

  // Start new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db';
    
    if (!mongoUri || mongoUri === 'mongodb://localhost:27017/portfolio_db') {
      console.warn('⚠️ MONGODB_URI not set, using default (may not work in production)');
    }

    cached.promise = mongoose.connect(mongoUri, opts)
      .then((mongooseInstance) => {
        console.log('✅ Connected to MongoDB');
        cached.conn = mongooseInstance.connection;
        return cached.conn;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    // Ensure connection is actually ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not ready after connect');
    }
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }
}

// Connect to MongoDB (only in non-serverless environments)
// In serverless (Vercel), connection will be established on first request
if (process.env.VERCEL !== '1') {
  connectDB().catch(console.error);
}

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
