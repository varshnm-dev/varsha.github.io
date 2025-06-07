const mongoose = require('mongoose');

const choreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Chore name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: [
            'Kitchen & Dining',
            'Laundry & Clothes',
            'Cleaning & Maintenance',
            'Shopping & Errands',
            'Bedroom & Organization',
            'Other'
        ],
        default: 'Other'
    },
    points: {
        type: Number,
        required: [true, 'Points value is required'],
        min: [1, 'Points must be at least 1']
    },
    emoji: {
        type: String,
        default: '✅'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    estimatedMinutes: {
        type: Number,
        min: [1, 'Estimated minutes must be at least 1'],
        default: 15
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: [true, 'Chore must belong to a household']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for chore completions
choreSchema.virtual('completions', {
    ref: 'CompletedChore',
    foreignField: 'chore',
    localField: '_id'
});

const Chore = mongoose.model('Chore', choreSchema);

module.exports = Chore;
