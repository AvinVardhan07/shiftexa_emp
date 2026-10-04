const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', campaignController.getCampaigns);
router.post('/', campaignController.createCampaign);
router.patch('/:id/toggle', campaignController.toggleCampaignStatus);

module.exports = router;
