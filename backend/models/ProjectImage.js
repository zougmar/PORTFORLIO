import mongoose from 'mongoose';

const projectImageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    default: 'image/jpeg'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const ProjectImage = mongoose.model('ProjectImage', projectImageSchema);

export default ProjectImage;
