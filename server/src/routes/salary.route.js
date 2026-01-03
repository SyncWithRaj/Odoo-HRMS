const express = require('express');
const { protect, admin } = require('../middlewares/auth.middleware');
const { getSalary, upsertSalary } = require('../controllers/salary.controller');

const router = express.Router();

// Get Salary (User can see own, Admin can see all)
router.get('/:userId', protect, getSalary);

// Update/Create Salary (Admin Only)
router.post('/:userId', protect, admin, upsertSalary);

module.exports = router;