import multer from 'multer';

// Always use memory storage to avoid filesystem issues in serverless environments
// In Vercel/serverless, filesystem is read-only, so we can't use disk storage
// For production, you should use cloud storage (Vercel Blob, Cloudinary, AWS S3)
const storage = multer.memoryStorage();

// File filter - only allow image files
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;
