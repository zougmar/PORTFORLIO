import express from 'express';
import { body, validationResult } from 'express-validator';
import Skill from '../models/Skill.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1, category: 1 });
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/skills/:id
// @desc    Get single skill
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/skills
// @desc    Create new skill
// @access  Private/Admin
router.post('/', protect, admin, [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category').isIn(['language', 'framework', 'database', 'tool', 'other']).withMessage('Invalid category'),
  body('proficiency').isInt({ min: 0, max: 100 }).withMessage('Proficiency must be between 0 and 100')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/skills/:id
// @desc    Update skill
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json(skill);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete skill
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
