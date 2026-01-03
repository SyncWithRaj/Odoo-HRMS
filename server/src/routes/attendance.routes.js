const express = require('express');
const { protect, admin } = require('../middlewares/auth.middleware'); // Import admin middleware
const { getStatus, checkIn, checkOut, getMyHistory, getAllAttendance } = require('../controllers/attendance.controller');

const router = express.Router();

router.get('/status', protect, getStatus);
router.post('/check-in', protect, checkIn);
router.put('/check-out', protect, checkOut);
router.get('/my-history', protect, getMyHistory);

// [NEW] Admin Route
router.get('/all', protect, admin, getAllAttendance);

module.exports = router;