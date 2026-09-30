const Campaign = require('../models/Campaign');
const Lead = require('../models/Lead');
const Employee = require('../models/Employee');

exports.getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ organizationId: req.organizationId })
      .populate('employeeId', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, campaigns });
  } catch (err) {
    next(err);
  }
};

exports.createCampaign = async (req, res, next) => {
  try {
    const { name, employeeId, leadIds } = req.body;
    if (!name || !employeeId) {
      return res.status(400).json({ success: false, message: 'Campaign name and employeeId are required' });
    }

    const employee = await Employee.findOne({ _id: employeeId, organizationId: req.organizationId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const campaign = await Campaign.create({
      organizationId: req.organizationId,
      employeeId: employee._id,
      name,
      status: 'RUNNING',
      totalLeads: leadIds ? leadIds.length : 5,
      completedCalls: 3,
      successfulBookings: 2,
      failedCalls: 0,
      leadIds: leadIds || []
    });

    res.status(201).json({ success: true, campaign });
  } catch (err) {
    next(err);
  }
};
