const Call = require('../models/Call');

exports.getCalls = async (req, res, next) => {
  try {
    const calls = await Call.find({ organizationId: req.organizationId })
      .populate('employeeId', 'name templateId')
      .populate('leadId', 'name phone email status')
      .sort({ startedAt: -1 });

    res.json({ success: true, calls });
  } catch (err) {
    next(err);
  }
};

exports.getCallById = async (req, res, next) => {
  try {
    const call = await Call.findOne({ _id: req.params.id, organizationId: req.organizationId })
      .populate('employeeId')
      .populate('leadId');

    if (!call) {
      return res.status(404).json({ success: false, message: 'Call record not found' });
    }

    res.json({ success: true, call });
  } catch (err) {
    next(err);
  }
};
