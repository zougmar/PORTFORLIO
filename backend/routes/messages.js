import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import { protect, admin } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST /api/messages
// @desc    Create new message
// @access  Public
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const message = await Message.create(req.body);

    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'o.zouglah03@gmail.com',
        subject: `Portfolio Contact: ${req.body.subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Subject:</strong> ${req.body.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${req.body.message}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/messages
// @desc    Get all messages
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/messages/:id
// @desc    Get single message
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Mark as read
    message.read = true;
    await message.save();
    
    res.json(message);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/messages/:id
// @desc    Update message (e.g., mark as read/unread)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Update read status if provided
    if (req.body.read !== undefined) {
      message.read = req.body.read;
    }
    
    await message.save();
    res.json(message);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
