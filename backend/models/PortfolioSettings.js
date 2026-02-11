import mongoose from 'mongoose';

const portfolioSettingsSchema = new mongoose.Schema({
  cvUrlEn: {
    type: String,
    default: ''
  },
  cvFileNameEn: {
    type: String,
    default: 'CV_Omar_Zouglah_English.pdf'
  },
  cvFileDataEn: {
    type: Buffer,
    default: null
  },
  cvUrlFr: {
    type: String,
    default: ''
  },
  cvFileNameFr: {
    type: String,
    default: 'CV_Omar_Zouglah_French.pdf'
  },
  cvFileDataFr: {
    type: Buffer,
    default: null
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
portfolioSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const PortfolioSettings = mongoose.model('PortfolioSettings', portfolioSettingsSchema);

export default PortfolioSettings;
