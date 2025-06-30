const mongoose = require('mongoose');

const choreTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Template chore name is required'],
        trim: true,
        minlength: [2, 'Chore name must be at least 2 characters']
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Kitchen & Dining',
            'Laundry & Clothes', 
            'Cleaning & Maintenance',
            'Shopping & Errands',
            'Bedroom & Organization',
            'Other'
        ]
    },
    points: {
        type: Number,
        required: [true, 'Points are required'],
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
        default: 15,
        min: [1, 'Estimated minutes must be at least 1']
    },
    isActive: {
        type: Boolean,
        default: true
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

// Index for better query performance
choreTemplateSchema.index({ category: 1, isActive: 1 });
choreTemplateSchema.index({ name: 'text', description: 'text' });

const ChoreTemplate = mongoose.model('ChoreTemplate', choreTemplateSchema);

module.exports = ChoreTemplate;