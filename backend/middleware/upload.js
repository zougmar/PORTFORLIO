import multer from 'multer';

// Always use memory storage to avoid filesystem issues in serverless environments
// In Vercel/serverless, filesystem is read-only, so we can't use disk storage
// For production, you should use cloud storage (Vercel Blob, Cloudinary, AWS S3)
const storage = multer.memoryStorage();

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
