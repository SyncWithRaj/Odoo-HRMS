const express = require('express');
const { protect, admin } = require('../middlewares/auth.middleware');
const { getAllEmployees } = require('../controllers/user.controller');

const router = express.Router();

// Only Admin can see the full employee list
router.get('/', protect, admin, getAllEmployees);

module.exports = router;