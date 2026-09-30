const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const Organization = require('../models/Organization');
const postCallWorker = require('../services/postCallWorker');

exports.receiveLeadWebhook = async (req, res, next) => {
  try {
    const { apiKey, name, phone, email, source, notes } = req.body;

    const org = await Organization.findOne({ apiKey });
    if (!org) {
      return res.status(401).json({ success: false, message: 'Invalid API Key / Unauthorized webhook source' });
    }

    const employee = await Employee.findOne({ organizationId: org._id, takingCalls: true });

    const lead = await Lead.create({
      organizationId: org._id,
      assignedEmployeeId: employee ? employee._id : null,
      name: name || 'Incoming Webhook Lead',
      phone: phone || '+91 98765 43210',
      email: email || '',
      source: source || 'External Webhook API',
      status: 'NEW',
      'qualificationData.notes': notes || ''
    });

    console.log(`[Webhook] New lead received via webhook for ${org.name}: ${lead.name} (${lead.phone})`);

    res.json({
      success: true,
      message: 'Lead received and queued for AI employee calling.',
      leadId: lead._id
    });
  } catch (err) {
    next(err);
  }
};

exports.receiveVoiceWebhook = async (req, res, next) => {
  try {
    const { event, call_id, duration } = req.body;
    console.log(`[Voice Webhook Event] ${event} - Call ID: ${call_id}`);

    if (event === 'call_ended' && call_id) {
      await postCallWorker.processCompletedCall(call_id);
    }

    res.json({ success: true, received: true });
  } catch (err) {
    next(err);
  }
};
