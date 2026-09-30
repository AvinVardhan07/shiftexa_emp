const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  industry: { type: String, default: 'Real Estate' },
  location: { type: String, default: 'Hyderabad, India' },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  apiKey: { type: String, unique: true },
  webhookSecret: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', organizationSchema);
