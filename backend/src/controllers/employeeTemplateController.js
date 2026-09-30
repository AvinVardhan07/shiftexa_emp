const EmployeeTemplate = require('../models/EmployeeTemplate');

exports.getAllTemplates = async (req, res, next) => {
  try {
    const templates = await EmployeeTemplate.find({}).sort({ isFeatured: -1, name: 1 });
    res.json({ success: true, templates });
  } catch (err) {
    next(err);
  }
};

exports.getTemplateByCode = async (req, res, next) => {
  try {
    const template = await EmployeeTemplate.findOne({ code: req.params.code });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Employee template not found' });
    }
    res.json({ success: true, template });
  } catch (err) {
    next(err);
  }
};
