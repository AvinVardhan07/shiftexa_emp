const Integration = require('../models/Integration');

exports.getIntegrations = async (req, res, next) => {
  try {
    let integrations = await Integration.find({ organizationId: req.organizationId });
    
    if (integrations.length === 0) {
      // Seed default integrations
      integrations = await Integration.insertMany([
        {
          organizationId: req.organizationId,
          type: 'WHATSAPP',
          name: 'WhatsApp Business API (Meta)',
          status: 'CONNECTED',
          config: { phoneId: '+91 40 4892 1100', template: 'site_visit_confirmation' }
        },
        {
          organizationId: req.organizationId,
          type: 'GOOGLE_CALENDAR',
          name: 'Google Calendar Site Visit Booking',
          status: 'CONNECTED',
          config: { calendarId: 'sales@abcproperties.com' }
        },
        {
          organizationId: req.organizationId,
          type: 'CRM_WEBHOOK',
          name: 'Custom Webhook / Lead Source API',
          status: 'CONNECTED',
          config: { webhookUrl: 'http://localhost:5000/api/webhooks/leads' }
        }
      ]);
    }

    res.json({ success: true, integrations });
  } catch (err) {
    next(err);
  }
};
