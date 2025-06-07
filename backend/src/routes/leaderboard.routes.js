const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard.controller');
const { protect, restrictToSameHousehold } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Get leaderboard for different time periods
router.get('/daily', leaderboardController.getDailyLeaderboard);
router.get('/weekly', leaderboardController.getWeeklyLeaderboard);
router.get('/monthly', leaderboardController.getMonthlyLeaderboard);
router.get('/all-time', leaderboardController.getAllTimeLeaderboard);

module.exports = router;
