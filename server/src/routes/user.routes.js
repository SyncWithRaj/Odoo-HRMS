const express = require('express');
const { protect, admin } = require('../middlewares/auth.middleware');
const { 
  getAllEmployees, 
  getUserById, 
  updateUserProfile,
  getUserProfile,
  uploadMiddleware // <--- Import this
} = require('../controllers/user.controller');

const router = express.Router();

// Apply uploadMiddleware to handle 'multipart/form-data'
router.put('/profile', protect, uploadMiddleware, updateUserProfile);

router.get('/profile', protect, getUserProfile);
router.get('/', protect, getAllEmployees); 
router.get('/:id', protect, admin, getUserById);

module.exports = router;