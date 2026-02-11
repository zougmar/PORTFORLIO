import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import PortfolioSettings from '../models/PortfolioSettings.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   GET /api/settings
// @desc    Get portfolio settings
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const settings = await PortfolioSettings.getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/settings
// @desc    Update portfolio settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res, next) => {
  try {
    let settings = await PortfolioSettings.findOne();
    if (!settings) {
      settings = await PortfolioSettings.create(req.body);
    } else {
      settings = await PortfolioSettings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/settings/upload-cv
// @desc    Upload CV file (English or French)
// @access  Private/Admin
router.post('/upload-cv', protect, admin, upload.single('cv'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { language } = req.body; // 'en' or 'fr'
    
    if (!language || !['en', 'fr'].includes(language)) {
      // Delete uploaded file if language is invalid
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({ message: 'Language must be "en" or "fr"' });
    }

    // Get current settings
    let settings = await PortfolioSettings.findOne();
    
    // Delete old CV file if exists
    const cvField = language === 'en' ? 'cvUrlEn' : 'cvUrlFr';
    if (settings && settings[cvField] && settings[cvField].startsWith('/uploads/')) {
      const oldFilePath = path.join(__dirname, '../', settings[cvField]);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update settings with new CV URL
    const cvUrl = `/uploads/${req.file.filename}`;
    const cvFileName = req.file.originalname;
    const updateData = language === 'en' 
      ? { cvUrlEn: cvUrl, cvFileNameEn: cvFileName }
      : { cvUrlFr: cvUrl, cvFileNameFr: cvFileName };

    if (!settings) {
      settings = await PortfolioSettings.create(updateData);
    } else {
      settings = await PortfolioSettings.findOneAndUpdate(
        {},
        updateData,
        { new: true }
      );
    }

    res.json({
      message: `CV (${language.toUpperCase()}) uploaded successfully`,
      ...updateData
    });
  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
});

export default router;
