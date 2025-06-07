const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Leaderboard entry must belong to a user']
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: [true, 'Leaderboard entry must belong to a household']
    },
    period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'allTime'],
        required: [true, 'Leaderboard period is required']
    },
    periodStart: {
        type: Date,
        required: [true, 'Period start date is required']
    },
    periodEnd: {
        type: Date,
        required: [true, 'Period end date is required']
    },
    points: {
        type: Number,
        default: 0
    },
    completedChores: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number
    }
}, {
    timestamps: true
});

// Create compound index for querying
leaderboardEntrySchema.index({ household: 1, period: 1, periodStart: 1, periodEnd: 1 });
leaderboardEntrySchema.index({ user: 1, period: 1 });

const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);

module.exports = LeaderboardEntry;
