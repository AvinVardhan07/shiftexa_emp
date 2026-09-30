const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', leadController.getLeads);
router.post('/', leadController.createLead);
router.post('/:id/call', leadController.triggerLeadCall);

module.exports = router;
