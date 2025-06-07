const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Routes accessible to both admin and regular members
router.get('/me', userController.getMe);
router.get('/stats', userController.getUserStats);
router.get('/achievements', userController.getUserAchievements);
router.get('/streaks', userController.getUserStreaks);

// Admin only routes
router.get('/', restrictTo('admin'), userController.getAllUsers);
router.get('/:id', restrictTo('admin'), userController.getUser);
router.patch('/:id', restrictTo('admin'), userController.updateUser);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

module.exports = router;
