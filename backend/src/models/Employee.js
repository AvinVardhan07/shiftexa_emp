const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeTemplate', required: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['DRAFT', 'TRAINING', 'READY', 'LIVE', 'PAUSED'], 
    default: 'DRAFT' 
  },
  takingCalls: { type: Boolean, default: false },
  phoneNumber: { type: String, default: '+91 40 4892 1100' },
  publishedVersionId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeVersion', default: null },
  currentDraftVersion: { type: Number, default: 1 },
  configuration: {
    language: { type: String, default: 'Telugu + English (Hyderabad)' },
    regionalStyle: { type: String, default: 'Hyderabad Casual Professional' },
    formality: { type: String, default: 'Casual Professional' },
    salesApproach: { type: String, default: 'Consultative & Helpful' },
    workingHours: { type: String, default: '09:00 AM - 08:00 PM IST' },
    greeting: { type: String, default: 'Hello sir, nenu Meera maatladutunnanu ABC Properties nunchi. Meeru Gachibowli lo 3BHK kosam enquiry chesaru kada?' },
    customInstructions: { type: String, default: 'Always speak in natural Indian conversational Telugu mixed with English. Never sound robotic. Act like a helpful real estate advisor.' }
  },
  stats: {
    totalCalls: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    qualifiedLeads: { type: Number, default: 0 },
    siteVisitsBooked: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

employeeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
