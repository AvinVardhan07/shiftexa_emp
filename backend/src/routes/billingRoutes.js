const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', billingController.getWalletDetails);
router.post('/top-up', billingController.topUpWallet);

module.exports = router;
