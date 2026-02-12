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
    // Exclude file buffers from response (too large)
    const settingsResponse = {
      cvUrlEn: settings.cvUrlEn || '',
      cvFileNameEn: settings.cvFileNameEn || '',
      cvUrlFr: settings.cvUrlFr || '',
      cvFileNameFr: settings.cvFileNameFr || '',
      professionalSummary: settings.professionalSummary || '',
      professionalSummaryFr: settings.professionalSummaryFr || '',
      professionalSummaryAr: settings.professionalSummaryAr || '',
      services: settings.services || []
    };
    res.json(settingsResponse);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/settings
// @desc    Update portfolio settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res, next) => {
  try {
    let settings = await PortfolioSettings.getSettings();
    
    // Prepare update data - only include fields that are being updated
    const updateData = {};
    
    // Update professional summary fields if provided
    if (req.body.professionalSummary !== undefined) {
      updateData.professionalSummary = req.body.professionalSummary;
    }
    if (req.body.professionalSummaryFr !== undefined) {
      updateData.professionalSummaryFr = req.body.professionalSummaryFr;
    }
    if (req.body.professionalSummaryAr !== undefined) {
      updateData.professionalSummaryAr = req.body.professionalSummaryAr;
    }
    
    // Update services if provided
    if (req.body.services !== undefined) {
      updateData.services = req.body.services;
    }
    
    // Update CV fields if provided (but preserve file data)
    if (req.body.cvUrlEn !== undefined) {
      updateData.cvUrlEn = req.body.cvUrlEn;
    }
    if (req.body.cvFileNameEn !== undefined) {
      updateData.cvFileNameEn = req.body.cvFileNameEn;
    }
    if (req.body.cvUrlFr !== undefined) {
      updateData.cvUrlFr = req.body.cvUrlFr;
    }
    if (req.body.cvFileNameFr !== undefined) {
      updateData.cvFileNameFr = req.body.cvFileNameFr;
    }
    
    // Update the settings
    settings = await PortfolioSettings.findOneAndUpdate(
      {},
      updateData,
      { new: true, runValidators: true }
    );
    
    // Exclude file buffers from response
    const responseData = {
      cvUrlEn: settings.cvUrlEn || '',
      cvFileNameEn: settings.cvFileNameEn || '',
      cvUrlFr: settings.cvUrlFr || '',
      cvFileNameFr: settings.cvFileNameFr || '',
      professionalSummary: settings.professionalSummary || '',
      professionalSummaryFr: settings.professionalSummaryFr || '',
      professionalSummaryAr: settings.professionalSummaryAr || '',
      services: settings.services || []
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Error updating settings:', error);
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
      return res.status(400).json({ message: 'Language must be "en" or "fr"' });
    }

    // Get current settings
    let settings = await PortfolioSettings.findOne();
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `cv_${language}_${timestamp}_${sanitizedOriginalName}`;
    
    // Store file buffer in database and create URL endpoint
    const cvUrl = `/api/settings/cv/${language}`;
    const cvFileName = req.file.originalname;
    
    const updateData = language === 'en' 
      ? { 
          cvUrlEn: cvUrl, 
          cvFileNameEn: cvFileName,
          cvFileDataEn: req.file.buffer
        }
      : { 
          cvUrlFr: cvUrl, 
          cvFileNameFr: cvFileName,
          cvFileDataFr: req.file.buffer
        };

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
      cvUrlEn: settings.cvUrlEn,
      cvFileNameEn: settings.cvFileNameEn,
      cvUrlFr: settings.cvUrlFr,
      cvFileNameFr: settings.cvFileNameFr
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/settings/cv/:language
// @desc    Download CV file (English or French)
// @access  Public
router.get('/cv/:language', async (req, res, next) => {
  try {
    const { language } = req.params;
    
    if (!['en', 'fr'].includes(language)) {
      return res.status(400).json({ message: 'Language must be "en" or "fr"' });
    }

    const settings = await PortfolioSettings.getSettings();
    const fileData = language === 'en' ? settings.cvFileDataEn : settings.cvFileDataFr;
    const fileName = language === 'en' ? settings.cvFileNameEn : settings.cvFileNameFr;

    if (!fileData || !fileData.length) {
      return res.status(404).json({ message: `CV (${language.toUpperCase()}) not found` });
    }

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName || `CV_${language.toUpperCase()}.pdf`}"`);
    res.setHeader('Content-Length', fileData.length);

    // Send the file buffer
    res.send(fileData);
  } catch (error) {
    next(error);
  }
});

export default router;
