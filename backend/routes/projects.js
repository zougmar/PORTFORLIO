import express from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import ProjectImage from '../models/ProjectImage.js';
import { protect, admin } from '../middleware/auth.js';
import uploadImage from '../middleware/uploadImage.js';

const router = express.Router();
const projectUpload = uploadImage.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 8 }
]);

const galleryUrls = (projectId, images) => images.map((image) => (
  `/api/projects/${projectId}/gallery/${image._id}?v=${new Date(image.updatedAt).getTime()}`
));

const attachGalleries = async (projects) => {
  const ids = projects.map((project) => project._id);
  const images = await ProjectImage.find({ project: { $in: ids } })
    .select('project updatedAt order')
    .sort({ order: 1, createdAt: 1 });

  return projects.map((project) => {
    const projectObj = typeof project.toObject === 'function' ? project.toObject() : { ...project };
    projectObj.images = galleryUrls(
      project._id,
      images.filter((image) => image.project.toString() === project._id.toString())
    );
    return projectObj;
  });
};

const saveGalleryFiles = async (projectId, files = []) => {
  if (!files.length) return;
  const count = await ProjectImage.countDocuments({ project: projectId });
  await ProjectImage.insertMany(files.map((file, index) => ({
    project: projectId,
    data: file.buffer,
    contentType: file.mimetype || 'image/jpeg',
    order: count + index
  })));
};

const removeGalleryImages = async (projectId, rawIds) => {
  const ids = String(rawIds || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  if (!ids.length) return;
  await ProjectImage.deleteMany({ _id: { $in: ids }, project: projectId });
};

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
        projectObj.image = `/api/projects/${project._id}/image?v=${new Date(project.updatedAt).getTime()}`;
      }
      return projectObj;
    });
    res.json(await attachGalleries(projectsWithImageUrls));
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
    res.setHeader('Cache-Control', req.query.v ? 'public, max-age=86400' : 'no-cache, no-store, must-revalidate');
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
      projectObj.image = `/api/projects/${project._id}/image?v=${new Date(project.updatedAt).getTime()}`;
    }
    const [withGallery] = await attachGalleries([projectObj]);
    res.json(withGallery);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private/Admin
router.get('/:id/gallery/:imageId', async (req, res, next) => {
  try {
    const image = await ProjectImage.findOne({
      _id: req.params.imageId,
      project: req.params.id
    }).select('data contentType');

    if (!image || !image.data || !image.data.length) {
      return res.status(404).json({ message: 'Project image not found' });
    }

    res.setHeader('Content-Type', image.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', req.query.v ? 'public, max-age=86400' : 'no-cache, no-store, must-revalidate');
    res.send(image.data);
  } catch (error) {
    next(error);
  }
});

router.post('/', protect, admin, projectUpload, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').optional({ values: 'falsy' }).isIn(['web', 'mobile', 'fullstack', 'other']).withMessage('Invalid category')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // With memory storage, no file to delete
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = { ...req.body };
    if (!projectData.category) {
      projectData.category = 'web';
    }
    
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
    const cover = req.files?.image?.[0];
    if (cover) {
      projectData.imageData = cover.buffer;
      projectData.image = '';
    }

    const project = await Project.create(projectData);
    
    if (cover) {
      project.image = `/api/projects/${project._id}/image`;
      await project.save();
    }
    await saveGalleryFiles(project._id, req.files?.images || []);
    
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
router.put('/:id', protect, admin, projectUpload, async (req, res, next) => {
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
    const cover = req.files?.image?.[0];
    if (cover) {
      updateData.imageData = cover.buffer;
      updateData.image = `/api/projects/${req.params.id}/image`;
    }

    await removeGalleryImages(req.params.id, req.body.removeImages);
    await saveGalleryFiles(req.params.id, req.files?.images || []);
    delete updateData.removeImages;
    delete updateData.images;
    
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
    await ProjectImage.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
