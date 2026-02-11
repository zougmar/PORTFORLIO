import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/auth.js';
import uploadImage from '../middleware/uploadImage.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private/Admin
router.post('/', protect, admin, uploadImage.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['web', 'mobile', 'fullstack', 'other']).withMessage('Invalid category')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails and file was uploaded, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = { ...req.body };
    
    // Handle technologies array from FormData
    if (req.body.technologies) {
      if (typeof req.body.technologies === 'string') {
        try {
          projectData.technologies = JSON.parse(req.body.technologies);
        } catch (e) {
          // If not JSON, treat as comma-separated string
          projectData.technologies = req.body.technologies.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(req.body.technologies)) {
        projectData.technologies = req.body.technologies;
      }
    }
    
    // If image was uploaded, set the image path
    if (req.file) {
      projectData.image = `/uploads/${req.file.filename}`;
    }

    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    // If error and file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private/Admin
router.put('/:id', protect, admin, uploadImage.single('image'), async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      // If project not found and file was uploaded, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = { ...req.body };
    
    // Handle technologies array from FormData
    if (req.body.technologies) {
      if (typeof req.body.technologies === 'string') {
        try {
          updateData.technologies = JSON.parse(req.body.technologies);
        } catch (e) {
          // If not JSON, treat as comma-separated string
          updateData.technologies = req.body.technologies.split(',').map(t => t.trim()).filter(t => t);
        }
      } else if (Array.isArray(req.body.technologies)) {
        updateData.technologies = req.body.technologies;
      }
    }
    
    // If new image was uploaded
    if (req.file) {
      // Delete old image if it exists and is a local file
      if (project.image && project.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', project.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Set new image path
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProject);
  } catch (error) {
    // If error and file was uploaded, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated image if it exists and is a local file
    if (project.image && project.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
