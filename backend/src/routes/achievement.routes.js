const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievement.controller');
const { protect, restrictToSameHousehold } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Get all achievements for the user
router.get('/my-achievements', achievementController.getMyAchievements);

// Get all household achievements
router.get('/household', achievementController.getHouseholdAchievements);

module.exports = router;
