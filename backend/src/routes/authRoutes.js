const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.get('/team', authenticate, authController.getTeamMembers);
router.post('/team/invite', authenticate, requireRole(['OWNER', 'ADMIN']), authController.inviteTeamMember);

module.exports = router;
