const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  updateAccessStatus,
  getDashboardStats
} = require('../controllers/employeeController');

router.get('/', getEmployees);
router.get('/stats', getDashboardStats);
router.get('/:id', getEmployeeById);
router.patch('/:id/access', updateAccessStatus);

module.exports = router;
