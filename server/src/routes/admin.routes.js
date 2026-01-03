const express = require('express');
const { protect, admin } = require('../middlewares/auth.middleware');
const { getDashboardStats } = require('../controllers/admin.controller');
const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;