const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  role: { type: String, enum: ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'], default: 'OWNER' },
  createdAt: { type: Date, default: Date.now }
});

membershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

module.exports = mongoose.model('Membership', membershipSchema);
