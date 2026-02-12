import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  titleFr: {
    type: String,
    trim: true
  },
  titleAr: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  descriptionFr: {
    type: String,
    trim: true
  },
  descriptionAr: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  imageData: {
    type: Buffer,
    default: null
  },
  technologies: [{
    type: String,
    trim: true
  }],
  githubUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'fullstack', 'other'],
    default: 'web'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
