const CompletedChore = require('../models/completedChore.model');
const Chore = require('../models/chore.model');
const User = require('../models/user.model');
const Household = require('../models/household.model');
const UserStreak = require('../models/userStreak.model');
const UserAchievement = require('../models/userAchievement.model');
const mongoose = require('mongoose');

/**
 * Get all completed chores for the user's household
 */
exports.getAllCompletedChores = async (req, res) => {
    try {
        // Base filter
        const filter = { household: req.user.household };

        // Additional filters
        if (req.query.user) {
            filter.user = req.query.user;
        }

        if (req.query.startDate && req.query.endDate) {
            filter.completedAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        } else if (req.query.startDate) {
            filter.completedAt = { $gte: new Date(req.query.startDate) };
        } else if (req.query.endDate) {
            filter.completedAt = { $lte: new Date(req.query.endDate) };
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Get completed chores
        const completedChores = await CompletedChore.find(filter)
            .sort({ completedAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'chore',
                select: 'name category points emoji'
            })
            .populate({
                path: 'user',
                select: 'username avatar'
            });

        // Get total count for pagination
        const total = await CompletedChore.countDocuments(filter);

        res.status(200).json({
            success: true,
            results: completedChores.length,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            },
            data: {
                completedChores
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
 * Get a specific completed chore
 */
exports.getCompletedChore = async (req, res) => {
    try {
        const completedChore = await CompletedChore.findById(req.params.id)
            .populate('chore')
            .populate('user', 'username avatar');

        if (!completedChore) {
            return res.status(404).json({
                success: false,
                message: 'No completed chore found with that ID'
            });
        }

        // Check if completed chore belongs to user's household
        if (completedChore.household.toString() !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only access completed chores in your own household'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                completedChore
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
 * Create a new completed chore
 */
exports.createCompletedChore = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Get chore details
        const chore = await Chore.findById(req.body.chore);

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
                message: 'You can only complete chores in your own household'
            });
        }

        // Calculate points (include household multiplier)
        const household = await Household.findById(req.user.household);
        const basePoints = chore.points;
        const multiplier = household.pointMultiplier || 1;
        const pointsEarned = basePoints * multiplier;

        // Determine who completed the chore (defaults to current user)
        const completedByUserId = req.body.completedBy || req.user._id;

        // Verify the completedBy user is in the same household
        if (req.body.completedBy && req.body.completedBy !== req.user._id) {
            const completedByUser = await User.findById(req.body.completedBy);
            if (!completedByUser || completedByUser.household.toString() !== req.user.household.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected user is not in your household'
                });
            }
        }

        // Create completed chore
        const completedChore = await CompletedChore.create({
            chore: chore._id,
            user: completedByUserId,
            household: req.user.household,
            pointsEarned,
            qualityRating: req.body.qualityRating || 3,
            completionTime: req.body.completionTime,
            notes: req.body.notes,
            collaborators: req.body.collaborators || [],
            completedAt: new Date()
        });

        // Update user points (for the user who completed the chore)
        await User.findByIdAndUpdate(
            completedByUserId,
            { $inc: { points: pointsEarned } }
        );

        // Update or create user streak
        await updateUserStreak(completedByUserId);

        // Check for achievements
        await checkAndGrantAchievements(completedByUserId, chore.category);

        await session.commitTransaction();
        session.endSession();

        // Populate response
        const populatedCompletedChore = await CompletedChore.findById(completedChore._id)
            .populate('chore')
            .populate('user', 'username avatar');

        res.status(201).json({
            success: true,
            data: {
                completedChore: populatedCompletedChore
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update a completed chore (can only update own entries)
 */
exports.updateCompletedChore = async (req, res) => {
    try {
        // Find completed chore
        const completedChore = await CompletedChore.findById(req.params.id);

        if (!completedChore) {
            return res.status(404).json({
                success: false,
                message: 'No completed chore found with that ID'
            });
        }

        // Check if completed chore belongs to user
        if (completedChore.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own completed chores'
            });
        }

        // Filter allowed fields
        const allowedFields = ['qualityRating', 'completionTime', 'notes'];
        const filteredBody = {};
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredBody[key] = req.body[key];
            }
        });

        // Update completed chore
        const updatedCompletedChore = await CompletedChore.findByIdAndUpdate(
            req.params.id,
            filteredBody,
            {
                new: true,
                runValidators: true
            }
        ).populate('chore').populate('user', 'username avatar');

        res.status(200).json({
            success: true,
            data: {
                completedChore: updatedCompletedChore
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
 * Delete a completed chore (can only delete own entries)
 */
exports.deleteCompletedChore = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find completed chore
        const completedChore = await CompletedChore.findById(req.params.id);

        if (!completedChore) {
            return res.status(404).json({
                success: false,
                message: 'No completed chore found with that ID'
            });
        }

        // Check if completed chore belongs to user
        if (completedChore.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own completed chores'
            });
        }

        // Remove points from user
        await User.findByIdAndUpdate(
            req.user._id,
            { $inc: { points: -completedChore.pointsEarned } }
        );

        // Delete completed chore
        await CompletedChore.findByIdAndDelete(req.params.id);

        await session.commitTransaction();
        session.endSession();

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Helper function to update user streak
 */
async function updateUserStreak(userId) {
    // Get or create streak record
    let streak = await UserStreak.findOne({ user: userId });

    if (!streak) {
        streak = await UserStreak.create({
            user: userId,
            currentStreak: 1,
            longestStreak: 1,
            lastActiveDate: new Date(),
            streakHistory: [{
                date: new Date(),
                choreCount: 1
            }]
        });
        return streak;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(streak.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if already recorded for today
    const todayEntry = streak.streakHistory.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
    });

    if (todayEntry) {
        // Already logged today, just increment the count
        todayEntry.choreCount += 1;
    } else {
        // New day
        if (lastActive.getTime() === yesterday.getTime()) {
            // Consecutive day, increment streak
            streak.currentStreak += 1;

            // Update longest streak if needed
            if (streak.currentStreak > streak.longestStreak) {
                streak.longestStreak = streak.currentStreak;
            }
        } else if (lastActive.getTime() !== today.getTime()) {
            // Streak broken, reset to 1
            streak.currentStreak = 1;
        }

        // Add new entry for today
        streak.streakHistory.push({
            date: today,
            choreCount: 1
        });
    }

    // Update last active date
    streak.lastActiveDate = new Date();

    // Save changes
    await streak.save();

    return streak;
}

/**
 * Helper function to check for and grant achievements
 */
async function checkAndGrantAchievements(userId, choreCategory) {
    // Get user data
    const user = await User.findById(userId);
    const completedChoresCount = await CompletedChore.countDocuments({ user: userId });
    const streak = await UserStreak.findOne({ user: userId });

    // Define achievements to check
    const achievements = [
        // Chore count achievements
        {
            name: 'First Chore',
            condition: completedChoresCount >= 1,
            description: 'Completed your first chore'
        },
        {
            name: 'Ten Chores',
            condition: completedChoresCount >= 10,
            description: 'Completed 10 chores'
        },
        {
            name: 'Fifty Chores',
            condition: completedChoresCount >= 50,
            description: 'Completed 50 chores'
        },
        {
            name: 'Hundred Chores',
            condition: completedChoresCount >= 100,
            description: 'Completed 100 chores'
        },

        // Streak achievements
        {
            name: '3 Day Streak',
            condition: streak && streak.currentStreak >= 3,
            description: 'Completed chores for 3 days in a row'
        },
        {
            name: '7 Day Streak',
            condition: streak && streak.currentStreak >= 7,
            description: 'Completed chores for 7 days in a row'
        },
        {
            name: '30 Day Streak',
            condition: streak && streak.currentStreak >= 30,
            description: 'Completed chores for 30 days in a row'
        },

        // Points achievements
        {
            name: '100 Points',
            condition: user.points >= 100,
            description: 'Earned 100 points'
        },
        {
            name: '500 Points',
            condition: user.points >= 500,
            description: 'Earned 500 points'
        },
        {
            name: '1000 Points',
            condition: user.points >= 1000,
            description: 'Earned 1000 points'
        },
        {
            name: '5000 Points',
            condition: user.points >= 5000,
            description: 'Earned 5000 points'
        }
    ];

    // Category mastery achievements
    if (choreCategory) {
        const categoryCount = await CompletedChore.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $lookup: { from: 'chores', localField: 'chore', foreignField: '_id', as: 'choreDetails' } },
            { $unwind: '$choreDetails' },
            { $match: { 'choreDetails.category': choreCategory } },
            { $count: 'count' }
        ]);

        if (categoryCount.length > 0 && categoryCount[0].count >= 20) {
            let achievementName = '';

            switch (choreCategory) {
                case 'Kitchen & Dining':
                    achievementName = 'Kitchen Master';
                    break;
                case 'Cleaning & Maintenance':
                    achievementName = 'Cleaning Specialist';
                    break;
                case 'Bedroom & Organization':
                    achievementName = 'Organization Expert';
                    break;
                case 'Shopping & Errands':
                    achievementName = 'Shopping Pro';
                    break;
                case 'Laundry & Clothes':
                    achievementName = 'Laundry Champion';
                    break;
                default:
                    break;
            }

            if (achievementName) {
                achievements.push({
                    name: achievementName,
                    condition: true,
                    description: `Completed 20 ${choreCategory} chores`
                });
            }
        }
    }

    // Grant achievements
    for (const achievement of achievements) {
        if (achievement.condition) {
            // Check if already granted
            const existingAchievement = await UserAchievement.findOne({
                user: userId,
                achievement: achievement.name
            });

            if (!existingAchievement) {
                // Grant new achievement
                await UserAchievement.create({
                    user: userId,
                    achievement: achievement.name,
                    description: achievement.description,
                    earnedAt: new Date()
                });
            }
        }
    }
}
