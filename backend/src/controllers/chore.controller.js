const Chore = require('../models/chore.model');
const CompletedChore = require('../models/completedChore.model');

/**
 * Get all chores for the user's household
 */
exports.getAllChores = async (req, res) => {
    try {
        // Filter options
        const filter = { household: req.user.household };

        // Add category filter if provided
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Get all chores for household
        const chores = await Chore.find(filter);

        res.status(200).json({
            success: true,
            results: chores.length,
            data: {
                chores
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get a specific chore
 */
exports.getChore = async (req, res) => {
    try {
        const chore = await Chore.findById(req.params.id);

        if (!chore) {
            return res.status(404).json({
                success: false,
                message: 'No chore found with that ID'
            });
        }

        // Check if chore belongs to user's household
        if (chore.household.toString() !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only access chores in your own household'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                chore
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Create a new chore (admin only)
 */
exports.createChore = async (req, res) => {
    try {
        // Ensure chore is created for the admin's household
        req.body.household = req.user.household;

        // Create chore
        const chore = await Chore.create(req.body);

        res.status(201).json({
            success: true,
            data: {
                chore
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update a chore (admin only)
 */
exports.updateChore = async (req, res) => {
    try {
        // Find chore
        const chore = await Chore.findById(req.params.id);

        if (!chore) {
            return res.status(404).json({
                success: false,
                message: 'No chore found with that ID'
            });
        }

        // Check if chore belongs to admin's household
        if (chore.household.toString() !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update chores in your own household'
            });
        }

        // Update chore
        const updatedChore = await Chore.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: {
                chore: updatedChore
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete a chore (admin only)
 */
exports.deleteChore = async (req, res) => {
    try {
        // Find chore
        const chore = await Chore.findById(req.params.id);

        if (!chore) {
            return res.status(404).json({
                success: false,
                message: 'No chore found with that ID'
            });
        }

        // Check if chore belongs to admin's household
        if (chore.household.toString() !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete chores in your own household'
            });
        }

        // Delete chore
        await Chore.findByIdAndDelete(req.params.id);

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
