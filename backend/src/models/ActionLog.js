const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  callId: { type: mongoose.Schema.Types.ObjectId, ref: 'Call' },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  actionType: { type: String, enum: ['SEND_WHATSAPP', 'BOOK_CALENDAR_SITE_VISIT', 'UPDATE_CRM_LEAD', 'PROPERTY_LOOKUP', 'HUMAN_HANDOFF'], required: true },
  payload: { type: Object },
  result: { type: Object },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
  executedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
