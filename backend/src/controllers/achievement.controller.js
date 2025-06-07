const UserAchievement = require('../models/userAchievement.model');
const User = require('../models/user.model');

/**
 * Get all achievements for the current user
 */
exports.getMyAchievements = async (req, res) => {
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
 * Get all achievements for the user's household
 */
exports.getHouseholdAchievements = async (req, res) => {
    try {
        // Get all users in household
        const users = await User.find({ household: req.user.household });
        const userIds = users.map(user => user._id);

        // Get achievements for all users
        const achievements = await UserAchievement.find({ user: { $in: userIds } })
            .populate('user', 'username avatar')
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
