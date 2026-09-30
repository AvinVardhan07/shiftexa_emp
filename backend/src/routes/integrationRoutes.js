const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', integrationController.getIntegrations);

module.exports = router;
