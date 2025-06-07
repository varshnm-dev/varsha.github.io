const mongoose = require('mongoose');
const crypto = require('crypto');

const householdSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Household name is required'],
        trim: true,
        minlength: [2, 'Household name must be at least 2 characters']
    },
    inviteCode: {
        type: String,
        unique: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Household must have an admin']
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pointMultiplier: {
        type: Number,
        default: 1
    },
    weeklyResetDay: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        default: 'Sunday'
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

// Virtual fields for household chores
householdSchema.virtual('chores', {
    ref: 'Chore',
    foreignField: 'household',
    localField: '_id'
});

// Generate unique invite code before saving
householdSchema.pre('save', function(next) {
    if (!this.inviteCode) {
        this.inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    next();
});

const Household = mongoose.model('Household', householdSchema);

module.exports = Household;
