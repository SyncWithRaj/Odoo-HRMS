const express = require('express');
const { protect, admin } = require('../middlewares/auth.middleware');
const { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leave.controller');
const router = express.Router();

router.post('/apply', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.get('/all', protect, admin, getAllLeaves);
router.put('/status', protect, admin, updateLeaveStatus);

module.exports = router;