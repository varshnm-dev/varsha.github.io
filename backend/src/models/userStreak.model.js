const mongoose = require('mongoose');

const userStreakSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Streak must belong to a user'],
        unique: true
    },
    currentStreak: {
        type: Number,
        default: 0,
        min: [0, 'Current streak cannot be negative']
    },
    longestStreak: {
        type: Number,
        default: 0,
        min: [0, 'Longest streak cannot be negative']
    },
    lastActiveDate: {
        type: Date,
        default: Date.now
    },
    streakHistory: [{
        date: {
            type: Date,
            required: true
        },
        choreCount: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

const UserStreak = mongoose.model('UserStreak', userStreakSchema);

module.exports = UserStreak;
