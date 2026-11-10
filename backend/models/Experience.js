import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['experience', 'education'],
    default: 'experience'
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  titleFr: { type: String, trim: true, default: '' },
  titleAr: { type: String, trim: true, default: '' },
  organization: { type: String, trim: true, default: '' },
  organizationFr: { type: String, trim: true, default: '' },
  organizationAr: { type: String, trim: true, default: '' },
  location: { type: String, trim: true, default: '' },
  locationFr: { type: String, trim: true, default: '' },
  locationAr: { type: String, trim: true, default: '' },
  period: { type: String, trim: true, default: '' },
  periodFr: { type: String, trim: true, default: '' },
  periodAr: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  descriptionFr: { type: String, trim: true, default: '' },
  descriptionAr: { type: String, trim: true, default: '' },
  order: { type: Number, default: 0 },
  seedKey: { type: String, unique: true, sparse: true }
}, {
  timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
