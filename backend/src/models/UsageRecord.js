const mongoose = require('mongoose');

const usageRecordSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  callId: { type: mongoose.Schema.Types.ObjectId, ref: 'Call', required: true },
  durationSeconds: { type: Number, required: true },
  billedMinutes: { type: Number, required: true },
  ratePerMin: { type: Number, default: 3.50 },
  totalAmountCharged: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UsageRecord', usageRecordSchema);
