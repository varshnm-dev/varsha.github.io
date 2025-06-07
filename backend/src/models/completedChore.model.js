const mongoose = require('mongoose');

const completedChoreSchema = new mongoose.Schema({
    chore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chore',
        required: [true, 'Completed chore must reference a chore']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Completed chore must reference a user']
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: [true, 'Completed chore must belong to a household']
    },
    pointsEarned: {
        type: Number,
        required: [true, 'Points earned is required'],
        min: [0, 'Points earned must be at least 0']
    },
    qualityRating: {
        type: Number,
        min: [1, 'Quality rating must be at least 1'],
        max: [5, 'Quality rating cannot exceed 5'],
        default: 3
    },
    completionTime: {
        type: Number, // in minutes
        min: [1, 'Completion time must be at least 1 minute']
    },
    notes: {
        type: String,
        trim: true
    },
    collaborators: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        pointsEarned: {
            type: Number,
            default: 0
        }
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for frequent queries
completedChoreSchema.index({ user: 1, completedAt: -1 });
completedChoreSchema.index({ household: 1, completedAt: -1 });
completedChoreSchema.index({ chore: 1, completedAt: -1 });

const CompletedChore = mongoose.model('CompletedChore', completedChoreSchema);

module.exports = CompletedChore;
