const mongoose = require('mongoose');

const employeeTemplateSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String, default: '' },
  category: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  capabilities: [{ type: String }],
  supportedLanguages: [{ type: String }],
  defaultLanguage: { type: String, default: 'Telugu + English (Hyderabad)' },
  defaultStyle: { type: String, default: 'Friendly + Confident Consultative' },
  ratePerMin: { type: Number, default: 3.50 },
  sampleAudioUrl: { type: String, default: '' },
  defaultGreeting: { type: String },
  defaultSystemRules: { type: String },
  defaultQualificationQuestions: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmployeeTemplate', employeeTemplateSchema);
