const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/leads', webhookController.receiveLeadWebhook);
router.post('/voice', webhookController.receiveVoiceWebhook);

module.exports = router;
