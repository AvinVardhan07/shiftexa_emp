const mongoose = require('mongoose');

const transcriptLineSchema = new mongoose.Schema({
  speaker: { type: String, enum: ['Meera', 'Customer', 'AI', 'Lead'], required: true },
  text: { type: String, required: true },
  timestamp: { type: String }
});

const toolExecutionSchema = new mongoose.Schema({
  toolName: { type: String, required: true },
  args: { type: Object },
  result: { type: Object },
  status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
  executedAt: { type: Date, default: Date.now }
});

const callSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  providerCallId: { type: String, required: true, unique: true },
  direction: { type: String, enum: ['OUTBOUND', 'INBOUND', 'TEST'], default: 'OUTBOUND' },
  status: { 
    type: String, 
    enum: ['RINGING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NO_ANSWER', 'BUSY'], 
    default: 'IN_PROGRESS' 
  },
  durationSeconds: { type: Number, default: 0 },
  billedMinutes: { type: Number, default: 0 },
  costPerMin: { type: Number, default: 3.50 },
  totalCost: { type: Number, default: 0 },
  recordingUrl: { type: String, default: '' },
  transcript: [transcriptLineSchema],
  summary: { type: String, default: '' },
  outcome: { 
    type: String, 
    enum: ['QUALIFIED_SITE_VISIT_BOOKED', 'QUALIFIED_FOLLOW_UP', 'UNQUALIFIED', 'NOT_INTERESTED', 'WRONG_NUMBER', 'TEST_SUCCESSFUL'],
    default: 'TEST_SUCCESSFUL'
  },
  extractedData: {
    budget: String,
    preferredLocation: String,
    configuration: String,
    timeline: String,
    siteVisitSlot: String,
    whatsappSent: Boolean,
    sentiment: { type: String, default: 'POSITIVE' }
  },
  executedTools: [toolExecutionSchema],
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

module.exports = mongoose.model('Call', callSchema);
