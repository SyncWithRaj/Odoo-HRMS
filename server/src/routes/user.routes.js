const express = require('express');
const { protect, admin } = require('../middlewares/auth.middleware');
const { 
  getAllEmployees, 
  getUserById, 
  updateUserProfile,
  getUserProfile 
} = require('../controllers/user.controller');

const router = express.Router();

// 1. Profile Routes (Self)
router.put('/profile', protect, updateUserProfile);
router.get('/profile', protect, getUserProfile);

// 2. Shared & Admin Routes
// REMOVED 'admin' from the root GET so employees can fetch the list
router.get('/', protect, getAllEmployees); 

// Keep 'admin' here so only admins can see specific detailed popups/profiles
router.get('/:id', protect, admin, getUserById);

module.exports = router;