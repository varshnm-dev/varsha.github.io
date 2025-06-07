const LeaderboardEntry = require('../models/leaderboardEntry.model');
const User = require('../models/user.model');
const Household = require('../models/household.model');
const CompletedChore = require('../models/completedChore.model');
const mongoose = require('mongoose');

/**
 * Get daily leaderboard
 */
exports.getDailyLeaderboard = async (req, res) => {
    try {
        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        await generateLeaderboard('daily', today, tomorrow);

        // Get leaderboard entries
        const leaderboard = await LeaderboardEntry.find({
            household: req.user.household,
            period: 'daily',
            periodStart: today,
            periodEnd: tomorrow
        })
        .sort({ points: -1, completedChores: -1 })
        .populate('user', 'username avatar');

        res.status(200).json({
            success: true,
            results: leaderboard.length,
            data: {
                leaderboard
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
 * Get weekly leaderboard
 */
exports.getWeeklyLeaderboard = async (req, res) => {
    try {
        // Get current week's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        await generateLeaderboard('weekly', startOfWeek, endOfWeek);

        // Get leaderboard entries
        const leaderboard = await LeaderboardEntry.find({
            household: req.user.household,
            period: 'weekly',
            periodStart: startOfWeek,
            periodEnd: endOfWeek
        })
        .sort({ points: -1, completedChores: -1 })
        .populate('user', 'username avatar');

        res.status(200).json({
            success: true,
            results: leaderboard.length,
            data: {
                leaderboard,
                periodStart: startOfWeek,
                periodEnd: endOfWeek
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
 * Get monthly leaderboard
 */
exports.getMonthlyLeaderboard = async (req, res) => {
    try {
        // Get current month's date range
        const today = new Date();

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        await generateLeaderboard('monthly', startOfMonth, endOfMonth);

        // Get leaderboard entries
        const leaderboard = await LeaderboardEntry.find({
            household: req.user.household,
            period: 'monthly',
            periodStart: startOfMonth,
            periodEnd: endOfMonth
        })
        .sort({ points: -1, completedChores: -1 })
        .populate('user', 'username avatar');

        res.status(200).json({
            success: true,
            results: leaderboard.length,
            data: {
                leaderboard,
                periodStart: startOfMonth,
                periodEnd: endOfMonth
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
 * Get all-time leaderboard
 */
exports.getAllTimeLeaderboard = async (req, res) => {
    try {
        // Use user points directly for all-time leaderboard
        const users = await User.find({ household: req.user.household })
            .select('username avatar points')
            .sort({ points: -1 });

        // Count completed chores for each user
        const leaderboard = [];
        for (const user of users) {
            const completedChoresCount = await CompletedChore.countDocuments({
                user: user._id
            });

            leaderboard.push({
                user,
                points: user.points,
                completedChores: completedChoresCount,
                rank: leaderboard.length + 1
            });
        }

        res.status(200).json({
            success: true,
            results: leaderboard.length,
            data: {
                leaderboard
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
 * Helper function to generate/update leaderboard entries
 */
async function generateLeaderboard(period, startDate, endDate) {
    // Get all households
    const households = await Household.find();

    for (const household of households) {
        // Get all users in household
        const users = await User.find({ household: household._id });

        // For each user, calculate points and completed chores
        const leaderboardData = [];

        for (const user of users) {
            // Get completed chores in the period
            const completedChores = await CompletedChore.find({
                user: user._id,
                household: household._id,
                completedAt: { $gte: startDate, $lt: endDate }
            });

            // Calculate total points
            const points = completedChores.reduce((sum, chore) => sum + chore.pointsEarned, 0);

            leaderboardData.push({
                user: user._id,
                points,
                completedChores: completedChores.length
            });
        }

        // Sort by points (desc) and then by completedChores (desc)
        leaderboardData.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.completedChores - a.completedChores;
        });

        // Assign ranks
        leaderboardData.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        // Create or update leaderboard entries
        for (const entry of leaderboardData) {
            await LeaderboardEntry.findOneAndUpdate(
                {
                    user: entry.user,
                    household: household._id,
                    period,
                    periodStart: startDate,
                    periodEnd: endDate
                },
                {
                    points: entry.points,
                    completedChores: entry.completedChores,
                    rank: entry.rank
                },
                { upsert: true, new: true }
            );
        }
    }
}
