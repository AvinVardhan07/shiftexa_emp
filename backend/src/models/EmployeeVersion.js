const mongoose = require('mongoose');

const employeeVersionSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  versionNumber: { type: Number, required: true },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' },
  greeting: { type: String, required: true },
  instructions: { type: String, required: true },
  qualificationRules: [{ type: String }],
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmployeeVersion', employeeVersionSchema);
