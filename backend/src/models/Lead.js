const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  assignedEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  source: { type: String, default: 'Website Enquiry' }, // Website, Facebook Ads, Google Ads, Form, Referral
  status: { 
    type: String, 
    enum: ['NEW', 'CALLING', 'QUALIFIED', 'SITE_VISIT_BOOKED', 'UNQUALIFIED', 'CALLBACK_REQUESTED', 'DO_NOT_CALL'], 
    default: 'NEW' 
  },
  qualificationData: {
    budget: { type: String, default: '' }, // e.g. ₹1.5 Cr
    preferredLocation: { type: String, default: '' }, // e.g. Gachibowli
    configuration: { type: String, default: '' }, // e.g. 3BHK
    timeline: { type: String, default: '' }, // e.g. 1 Month
    buyingPurpose: { type: String, default: '' }, // Self-use / Investment
    keyMotivations: [{ type: String }], // e.g. ["Parents convenience", "Hospital proximity"]
    siteVisitDate: { type: String, default: '' }, // e.g. "2026-10-04 11:00 AM"
    hesitations: [{ type: String }],
    notes: { type: String, default: '' }
  },
  lastCallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Call' },
  lastCalledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
