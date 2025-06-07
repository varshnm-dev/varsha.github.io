const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't return password in queries
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household'
    },
    points: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    dailyStreak: {
        type: Number,
        default: 0
    },
    lastActive: {
        type: Date,
        default: Date.now
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

// Virtual fields for user achievements
userSchema.virtual('achievements', {
    ref: 'UserAchievement',
    foreignField: 'user',
    localField: '_id'
});

// Virtual fields for user completed chores
userSchema.virtual('completedChores', {
    ref: 'CompletedChore',
    foreignField: 'user',
    localField: '_id'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it's modified or new
    if (!this.isModified('password')) return next();

    // Hash password with strength of 12
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

// Method to compare passwords
userSchema.methods.checkPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
