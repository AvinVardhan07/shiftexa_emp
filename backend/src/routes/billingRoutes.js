const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', billingController.getWalletDetails);
router.post('/create-order', billingController.createRazorpayOrder);
router.post('/top-up', billingController.topUpWallet);
router.post('/auto-recharge', billingController.toggleAutoRecharge);
router.get('/invoices/:txId/gst', billingController.getGSTInvoice);

module.exports = router;
