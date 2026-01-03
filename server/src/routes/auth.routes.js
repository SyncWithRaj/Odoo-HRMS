const express = require('express');
const { register, login, sendOtp } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/send-otp', sendOtp); // New Route
router.post('/register', register);
router.post('/login', login);

module.exports = router;