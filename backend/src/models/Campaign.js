const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'PAUSED'], default: 'DRAFT' },
  totalLeads: { type: Number, default: 0 },
  completedCalls: { type: Number, default: 0 },
  successfulBookings: { type: Number, default: 0 },
  failedCalls: { type: Number, default: 0 },
  leadIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
  scheduledTime: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
