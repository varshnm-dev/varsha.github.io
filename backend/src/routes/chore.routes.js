const express = require('express');
const router = express.Router();
const choreController = require('../controllers/chore.controller');
const { protect, restrictTo, restrictToSameHousehold } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Routes accessible to all members
router.get('/', choreController.getAllChores);
router.get('/:id', choreController.getChore);

// Create a new chore (admin only)
router.post('/', restrictTo('admin'), choreController.createChore);

// Add chore from template (admin only)
router.post('/from-template/:templateId', restrictTo('admin'), choreController.addChoreFromTemplate);

// Update/Delete chores (admin only)
router.patch('/:id', restrictTo('admin'), choreController.updateChore);
router.delete('/:id', restrictTo('admin'), choreController.deleteChore);

module.exports = router;
