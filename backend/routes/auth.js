import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { isMailConfigured, mailer } from '../utils/mailer.js';

const RESET_WINDOW_MS = 60 * 60 * 1000;
const RESET_COOLDOWN_MS = 2 * 60 * 1000;
const GENERIC_RESET_MESSAGE = 'If an account with that email exists, a password reset link has been sent.';

const router = express.Router();

// Generate JWT Token
const generateToken = (id, passwordVersion = 0) => {
  return jwt.sign({ id, passwordVersion }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// REGISTRATION IS DISABLED FOR SECURITY - Only existing users can access admin panel
// To re-enable registration, uncomment the code below
/*
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: 'admin' // First user is admin
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
});
*/

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = String(req.body.email).toLowerCase().trim();
    const { password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password +passwordVersion');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.passwordVersion || 0)
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role
  });
});

const getFrontendUrl = () => {
  const configured = process.env.FRONTEND_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
};

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const clearResetToken = (user) => {
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
};

// @route   POST /api/auth/forgot-password
// @desc    Email a one-hour password reset link
// @access  Public
router.post('/forgot-password', [
  body('email').trim().isEmail().withMessage('Please provide a valid email')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    if (!isMailConfigured()) {
      return res.status(503).json({
        message: 'Password reset email is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS.'
      });
    }

    const email = String(req.body.email).toLowerCase().trim();
    const user = await User.findOne({ email }).select('+resetPasswordExpire');

    if (!user) {
      return res.json({ message: GENERIC_RESET_MESSAGE });
    }

    const tokenStillFresh = user.resetPasswordExpire
      && user.resetPasswordExpire.getTime() > Date.now() + RESET_WINDOW_MS - RESET_COOLDOWN_MS;

    if (tokenStillFresh) {
      return res.json({ message: GENERIC_RESET_MESSAGE });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + RESET_WINDOW_MS);
    await User.updateOne(
      { _id: user._id },
      { resetPasswordToken: hashResetToken(rawToken), resetPasswordExpire: expires }
    );

    const resetUrl = `${getFrontendUrl()}/reset-password?token=${rawToken}`;
    const text = [
      'You requested a password reset for your portfolio admin account.',
      '',
      'Open this link to choose a new password. It expires in 1 hour:',
      resetUrl,
      '',
      'If you did not request this, ignore this email. Your password will stay the same.'
    ].join('\n');
    const html = `
      <p>You requested a password reset for your portfolio admin account.</p>
      <p><a href="${resetUrl}">Choose a new password</a></p>
      <p>This link expires in 1 hour. If you did not request this, ignore this email. Your password will stay the same.</p>
    `;

    try {
      await mailer.send({
        to: user.email,
        subject: 'Reset your portfolio admin password',
        text,
        html
      });
    } catch (emailError) {
      await User.updateOne(
        { _id: user._id },
        { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } }
      );
      console.error('Password reset email failed:', emailError.message);
      return res.status(500).json({
        message: 'Could not send the reset email. Check the email settings and try again.'
      });
    }

    return res.json({ message: GENERIC_RESET_MESSAGE });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/reset-password
// @desc    Set a new password from a reset link
// @access  Public
router.post('/reset-password', [
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const hashedToken = hashResetToken(String(req.body.token).trim());
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }
    }).select('+password +passwordVersion +resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
    }

    const samePassword = await user.comparePassword(req.body.password);
    if (samePassword) {
      return res.status(400).json({ message: 'New password must be different from the current password.' });
    }

    user.password = req.body.password;
    clearResetToken(user);
    await user.save();
    await User.updateOne(
      { _id: user._id },
      { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } }
    );

    return res.json({ message: 'Password updated. You can sign in with the new password.' });
  } catch (error) {
    next(error);
  }
});

export default router;
