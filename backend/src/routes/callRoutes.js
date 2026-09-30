const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', callController.getCalls);
router.get('/:id', callController.getCallById);

module.exports = router;
