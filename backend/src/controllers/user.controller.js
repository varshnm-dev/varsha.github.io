const User = require('../models/user.model');
const UserAchievement = require('../models/userAchievement.model');
const UserStreak = require('../models/userStreak.model');
const CompletedChore = require('../models/completedChore.model');
const Household = require('../models/household.model');
const mongoose = require('mongoose');

/**
 * Get current user
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('household')
            .populate('achievements');

        res.status(200).json({
            success: true,
            data: {
                user
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
 * Get user statistics
 */
exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get completed chores
        const completedChores = await CompletedChore.find({ user: userId });

        // Get streaks
        const streaks = await UserStreak.findOne({ user: userId });

        // Get achievements
        const achievements = await UserAchievement.find({ user: userId });

        // Calculate stats
        const totalPoints = req.user.points;
        const totalChoresCompleted = completedChores.length;

        // Get chores by category
        const choresByCategory = await CompletedChore.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $lookup: { from: 'chores', localField: 'chore', foreignField: '_id', as: 'choreDetails' } },
            { $unwind: '$choreDetails' },
            { $group: {
                _id: '$choreDetails.category',
                count: { $sum: 1 },
                points: { $sum: '$pointsEarned' }
            }},
            { $project: {
                category: '$_id',
                count: 1,
                points: 1,
                _id: 0
            }}
        ]);

        // Get recent chores
        const recentChores = await CompletedChore.find({ user: userId })
            .sort({ completedAt: -1 })
            .limit(5)
            .populate('chore');

        res.status(200).json({
            success: true,
            data: {
                totalPoints,
                totalChoresCompleted,
                currentStreak: streaks ? streaks.currentStreak : 0,
                longestStreak: streaks ? streaks.longestStreak : 0,
                achievementsCount: achievements.length,
                choresByCategory,
                recentChores
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
 * Get user achievements
 */
exports.getUserAchievements = async (req, res) => {
    try {
        const achievements = await UserAchievement.find({ user: req.user.id })
            .sort({ earnedAt: -1 });

        res.status(200).json({
            success: true,
            results: achievements.length,
            data: {
                achievements
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
 * Get user streaks
 */
exports.getUserStreaks = async (req, res) => {
    try {
        const streaks = await UserStreak.findOne({ user: req.user.id });

        if (!streaks) {
            return res.status(404).json({
                success: false,
                message: 'No streaks found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                streaks
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
 * Get all users (admin only)
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Only admin can see all users, and only in their household
        const users = await User.find({ household: req.user.household });

        res.status(200).json({
            success: true,
            results: users.length,
            data: {
                users
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
 * Get a specific user (admin only)
 */
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that ID'
            });
        }

        // Ensure admin can only access users in their household
        if (user.household.toString() !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only access users in your own household'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user
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
 * Update a user (admin only)
 */
exports.updateUser = async (req, res) => {
    try {
        // Find user
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that ID'
            });
        }

        // Ensure admin can only update users in their household
        if (user.household.toString() !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update users in your own household'
            });
        }

        // Filter unwanted fields
        const filteredBody = {};
        const allowedFields = ['username', 'email', 'role', 'points', 'avatar'];
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredBody[key] = req.body[key];
            }
        });

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            filteredBody,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: {
                user: updatedUser
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
 * Delete a user (admin only)
 */
exports.deleteUser = async (req, res) => {
    try {
        // Find user
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that ID'
            });
        }

        // Ensure admin can only delete users in their household
        if (user.household.toString() !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete users in your own household'
            });
        }

        // Prevent admin from deleting themselves
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete yourself'
            });
        }

        // Delete user
        await User.findByIdAndDelete(req.params.id);

        // Remove user from household members array
        await Household.findByIdAndUpdate(
            user.household,
            { $pull: { members: user.id } }
        );

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
