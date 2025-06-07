const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Achievement must belong to a user']
    },
    achievement: {
        type: String,
        required: [true, 'Achievement name is required'],
        enum: [
            'First Chore',
            'Ten Chores',
            'Fifty Chores',
            'Hundred Chores',
            '3 Day Streak',
            '7 Day Streak',
            '30 Day Streak',
            'Kitchen Master',
            'Cleaning Specialist',
            'Organization Expert',
            'Shopping Pro',
            'Laundry Champion',
            '100 Points',
            '500 Points',
            '1000 Points',
            '5000 Points'
        ]
    },
    earnedAt: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: [true, 'Achievement description is required']
    },
    icon: {
        type: String,
        default: '🏆'
    }
}, {
    timestamps: true
});

// Create a compound index to ensure users can't earn the same achievement twice
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

module.exports = UserAchievement;
