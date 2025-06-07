const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.patch('/update-password', authController.updatePassword);
router.patch('/update-me', authController.updateMe);

module.exports = router;
