const express = require('express');
const router = express.Router();
const employeeTemplateController = require('../controllers/employeeTemplateController');

router.get('/', employeeTemplateController.getAllTemplates);
router.get('/:code', employeeTemplateController.getTemplateByCode);

module.exports = router;
