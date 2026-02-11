import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true
  },
  nameFr: {
    type: String,
    trim: true
  },
  nameAr: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['language', 'framework', 'database', 'tool', 'other'],
    required: [true, 'Skill category is required']
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency level is required'],
    min: [0, 'Proficiency must be between 0 and 100'],
    max: [100, 'Proficiency must be between 0 and 100']
  },
  icon: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
