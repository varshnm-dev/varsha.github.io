const express = require('express');
const router = express.Router();
const householdController = require('../controllers/household.controller');
const { protect, restrictTo, restrictToSameHousehold } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Create a new household (any user can create)
router.post('/', householdController.createHousehold);

// Join a household with invite code
router.post('/join', householdController.joinHousehold);

// Get current user's household
router.get('/my-household', householdController.getMyHousehold);

// Routes that require the user to be in the same household
router.use('/:householdId', restrictToSameHousehold);
router.get('/:householdId', householdController.getHousehold);

// Admin only routes
router.use('/:householdId', restrictTo('admin'));
router.patch('/:householdId', householdController.updateHousehold);
router.delete('/:householdId', householdController.deleteHousehold);
router.post('/:householdId/members', householdController.addMember);
router.delete('/:householdId/members/:userId', householdController.removeMember);
router.post('/:householdId/generate-invite', householdController.generateInviteCode);

module.exports = router;
