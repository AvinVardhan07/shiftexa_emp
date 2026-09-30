const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  configurationType: { type: String, required: true }, // e.g. 2BHK, 3BHK, Villa
  priceStarting: { type: String, required: true }, // e.g. ₹1.5 Cr
  priceRangeMax: { type: String }, // e.g. ₹1.8 Cr
  squareFeet: { type: String }, // e.g. 1850 - 2200 sqft
  possessionDate: { type: String }, // e.g. Dec 2026
  amenities: [{ type: String }],
  description: { type: String },
  isAvailable: { type: Boolean, default: true }
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' }
});

const knowledgeBaseSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  businessName: { type: String, default: 'ABC Properties' },
  businessOverview: { type: String, default: 'Leading real estate developer and sales agency in Hyderabad specializing in luxury residential apartments in Gachibowli, Financial District, and Hitec City.' },
  properties: [propertySchema],
  faqs: [faqSchema],
  qualificationCriteria: {
    minBudget: { type: String, default: '₹1.0 Crore' },
    targetLocations: [{ type: String }],
    requiredTimeline: { type: String, default: 'Within 1 to 6 months' }
  },
  approvedDiscounts: { type: String, default: 'Up to ₹2.0 Lakhs spot booking discount available upon site visit only.' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
