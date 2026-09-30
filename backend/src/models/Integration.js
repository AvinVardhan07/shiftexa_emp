const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  type: { type: String, enum: ['WHATSAPP', 'GOOGLE_CALENDAR', 'CRM_WEBHOOK', 'GOOGLE_SHEETS'], required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['CONNECTED', 'DISCONNECTED', 'ERROR'], default: 'CONNECTED' },
  config: { type: Object, default: {} },
  lastSyncAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Integration', integrationSchema);
