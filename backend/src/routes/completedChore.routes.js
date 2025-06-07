const express = require('express');
const router = express.Router();
const completedChoreController = require('../controllers/completedChore.controller');
const { protect, restrictToSameHousehold } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Get all completed chores for the user's household
router.get('/', completedChoreController.getAllCompletedChores);

// Get a specific completed chore
router.get('/:id', completedChoreController.getCompletedChore);

// Create a new completed chore (any authenticated user)
router.post('/', completedChoreController.createCompletedChore);

// Update own completed chore (same user only)
router.patch('/:id', completedChoreController.updateCompletedChore);

// Delete own completed chore (same user only)
router.delete('/:id', completedChoreController.deleteCompletedChore);

module.exports = router;
