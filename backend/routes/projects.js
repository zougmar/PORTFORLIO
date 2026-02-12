import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/auth.js';
import uploadImage from '../middleware/uploadImage.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().select('-imageData').sort({ order: 1, createdAt: -1 });
    // Get projects with image data to check which have images
    const projectsWithImages = await Project.find().select('_id imageData').lean();
    const imageMap = new Map();
    projectsWithImages.forEach(p => {
      if (p.imageData && p.imageData.length) {
        imageMap.set(p._id.toString(), true);
      }
    });
    
    // Add image URLs to projects that have images
    const projectsWithImageUrls = projects.map(project => {
      const projectObj = project.toObject();
      if (imageMap.has(project._id.toString())) {
        projectObj.image = `/api/projects/${project._id}/image`;
      }
      return projectObj;
    });
    res.json(projectsWithImageUrls);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects/:id/image
// @desc    Get project image
// @access  Public
router.get('/:id/image', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).select('imageData');
    if (!project || !project.imageData || !project.imageData.length) {
      return res.status(404).json({ message: 'Project image not found' });
    }

    // Determine content type (default to jpeg)
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(project.imageData);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).select('-imageData');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Add image URL if image exists
    const projectObj = project.toObject();
    const projectWithImage = await Project.findById(req.params.id).select('imageData');
    if (projectWithImage && projectWithImage.imageData && projectWithImage.imageData.length) {
      projectObj.image = `/api/projects/${project._id}/image`;
    }
    res.json(projectObj);
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
      // With memory storage, no file to delete
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
    
    // If image was uploaded, store in database
    if (req.file) {
      projectData.imageData = req.file.buffer;
      projectData.image = `/api/projects/${null}/image`; // Will be updated after creation
    }

    const project = await Project.create(projectData);
    
    // Update image URL with actual project ID
    if (req.file) {
      project.image = `/api/projects/${project._id}/image`;
      await project.save();
    }
    
    const projectResponse = project.toObject();
    delete projectResponse.imageData;
    res.status(201).json(projectResponse);
  } catch (error) {
    // With memory storage, no file to delete
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
    
    // If new image was uploaded, store in database
    if (req.file) {
      updateData.imageData = req.file.buffer;
      updateData.image = `/api/projects/${req.params.id}/image`;
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    const projectResponse = updatedProject.toObject();
    delete projectResponse.imageData;
    res.json(projectResponse);
  } catch (error) {
    // With memory storage, no file to delete
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

    // Image data is stored in database, will be deleted with project
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
