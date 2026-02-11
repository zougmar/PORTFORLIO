import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Safely configure storage - default to memory storage to avoid filesystem issues
let storage;

try {
  // Check if we're in a serverless environment (Vercel)
  const isServerless = 
    process.env.VERCEL === '1' || 
    process.env.VERCEL_URL || 
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env._HANDLER;

  if (isServerless) {
    // Always use memory storage in serverless
    storage = multer.memoryStorage();
    console.log('⚠️ Using memory storage (serverless environment)');
  } else {
    // Try to use disk storage in regular Node.js
    const uploadsDir = path.join(__dirname, '../uploads');
    try {
      // Test if we can create/write to directory
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      // If successful, use disk storage
      storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          cb(null, 'cv-' + uniqueSuffix + ext);
        }
      });
    } catch (error) {
      // Can't use disk, fallback to memory
      console.warn('⚠️ Cannot use disk storage, falling back to memory:', error.message);
      storage = multer.memoryStorage();
    }
  }
} catch (error) {
  // If anything fails, default to memory storage
  console.warn('⚠️ Error configuring storage, using memory storage:', error.message);
  storage = multer.memoryStorage();
}

// File filter - only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default upload;
