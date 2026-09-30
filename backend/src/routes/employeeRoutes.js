const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/', employeeController.hireEmployee);
router.get('/', employeeController.getOrganizationEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.patch('/:id', employeeController.updateEmployeeConfig);
router.post('/:id/publish', employeeController.publishVersion);
router.post('/:id/test-call', employeeController.startTestCall);
router.post('/test-call/interact', employeeController.interactTestCall);

module.exports = router;
