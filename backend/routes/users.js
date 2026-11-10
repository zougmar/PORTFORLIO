import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import uploadImage from '../middleware/uploadImage.js';

const router = express.Router();

const profileImageUrl = (user) => {
  const version = user?.updatedAt ? new Date(user.updatedAt).getTime() : Date.now();
  return `/api/users/profile/image/public?v=${version}`;
};

const sendProfileImage = (res, user, versioned) => {
  res.setHeader('Content-Type', user.imageContentType || 'image/jpeg');
  res.setHeader(
    'Cache-Control',
    versioned ? 'public, max-age=86400' : 'no-cache, no-store, must-revalidate'
  );
  res.send(user.imageData);
};

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/profile/public
// @desc    Get admin user profile (public - for portfolio display)
// @access  Public
router.get('/profile/public', async (req, res, next) => {
  try {
    // Get the admin user (first admin user)
    const adminUser = await User.findOne({ role: 'admin' }).select('-password -imageData');
    if (!adminUser) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Add image URL if image exists
    const userObj = adminUser.toObject();
    // Check if admin has image data
    const adminWithImage = await User.findOne({ role: 'admin' }).select('imageData');
    if (adminWithImage && adminWithImage.imageData && adminWithImage.imageData.length) {
      userObj.image = profileImageUrl(adminUser);
    }
    res.json(userObj);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/profile/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -imageData');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Add image URL if image exists
    const userObj = user.toObject();
    // Check if user has image data
    const userWithImage = await User.findById(req.user.id).select('imageData');
    if (userWithImage && userWithImage.imageData && userWithImage.imageData.length) {
      userObj.image = profileImageUrl(user);
    }
    res.json(userObj);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/profile/image
// @desc    Get user profile image (authenticated)
// @access  Private
router.get('/profile/image', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('imageData imageContentType');
    if (!user || !user.imageData || !user.imageData.length) {
      return res.status(404).json({ message: 'Profile image not found' });
    }

    sendProfileImage(res, user, Boolean(req.query.v));
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/profile/image/public
// @desc    Get admin user profile image (public - for portfolio display)
// @access  Public
router.get('/profile/image/public', async (req, res, next) => {
  try {
    // Get the admin user (first admin user)
    const adminUser = await User.findOne({ role: 'admin' }).select('imageData imageContentType');
    if (!adminUser || !adminUser.imageData || !adminUser.imageData.length) {
      return res.status(404).json({ message: 'Profile image not found' });
    }

    sendProfileImage(res, adminUser, Boolean(req.query.v));
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/profile/me
// @desc    Update current user profile
// @access  Private
router.put('/profile/me', protect, uploadImage.single('image'), async (req, res, next) => {
  try {
    const { username, email, phone, bio, location, jobTitle } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (jobTitle !== undefined) user.jobTitle = jobTitle;

    // Handle image upload - store in database
    if (req.file) {
      user.imageData = req.file.buffer;
      user.imageContentType = req.file.mimetype || 'image/jpeg';
      user.image = profileImageUrl({ updatedAt: new Date() });
    }

    await user.save();
    const updatedUser = await User.findById(user.id).select('-password -imageData');
    
    const userObj = updatedUser.toObject();
    if (user.imageData) {
      userObj.image = profileImageUrl(updatedUser);
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userObj
    });
  } catch (error) {
    next(error);
  }
});

export default router;
