const mongoose = require('mongoose');
const ChoreTemplate = require('../models/choreTemplate.model');

// Template chores for the marketplace
const choreTemplates = [
    // Original chores
    {
        name: 'Wash dishes',
        category: 'Kitchen & Dining',
        points: 5,
        emoji: '🍽️',
        difficulty: 'Easy',
        estimatedMinutes: 15
    },
    {
        name: 'Take out trash',
        category: 'Cleaning & Maintenance',
        points: 3,
        emoji: '🗑️',
        difficulty: 'Easy',
        estimatedMinutes: 5
    },
    {
        name: 'Vacuum floors',
        category: 'Cleaning & Maintenance',
        points: 8,
        emoji: '🧹',
        difficulty: 'Medium',
        estimatedMinutes: 20
    },
    {
        name: 'Mow lawn',
        category: 'Cleaning & Maintenance',
        points: 15,
        emoji: '🌿',
        difficulty: 'Hard',
        estimatedMinutes: 45
    },
    {
        name: 'Do laundry',
        category: 'Laundry & Clothes',
        points: 10,
        emoji: '👕',
        difficulty: 'Medium',
        estimatedMinutes: 30
    },
    {
        name: 'Make bed',
        category: 'Bedroom & Organization',
        points: 2,
        emoji: '🛏️',
        difficulty: 'Easy',
        estimatedMinutes: 5
    },
    {
        name: 'Clean bathroom',
        category: 'Cleaning & Maintenance',
        points: 12,
        emoji: '🚿',
        difficulty: 'Hard',
        estimatedMinutes: 30
    },
    {
        name: 'Cook dinner',
        category: 'Kitchen & Dining',
        points: 10,
        emoji: '🍳',
        difficulty: 'Medium',
        estimatedMinutes: 45
    },
    {
        name: 'Grocery shopping',
        category: 'Shopping & Errands',
        points: 8,
        emoji: '🛒',
        difficulty: 'Medium',
        estimatedMinutes: 60
    },
    {
        name: 'Water plants',
        category: 'Cleaning & Maintenance',
        points: 3,
        emoji: '🌱',
        difficulty: 'Easy',
        estimatedMinutes: 10
    },
    {
        name: 'Clean windows',
        category: 'Cleaning & Maintenance',
        points: 7,
        emoji: '🪟',
        difficulty: 'Medium',
        estimatedMinutes: 20
    },
    {
        name: 'Put away groceries',
        category: 'Kitchen & Dining',
        points: 4,
        emoji: '🥫',
        difficulty: 'Easy',
        estimatedMinutes: 15
    },
    {
        name: 'Fold and put away laundry',
        category: 'Laundry & Clothes',
        points: 7,
        emoji: '👕',
        difficulty: 'Medium',
        estimatedMinutes: 20
    },
    {
        name: 'Clean refrigerator',
        category: 'Kitchen & Dining',
        points: 8,
        emoji: '🧊',
        difficulty: 'Medium',
        estimatedMinutes: 25
    },
    {
        name: 'Organize closet',
        category: 'Bedroom & Organization',
        points: 9,
        emoji: '👗',
        difficulty: 'Medium',
        estimatedMinutes: 30
    },
    {
        name: 'Clean gutters',
        category: 'Cleaning & Maintenance',
        points: 15,
        emoji: '🏠',
        difficulty: 'Hard',
        estimatedMinutes: 60
    },
    {
        name: 'Change bed sheets',
        category: 'Bedroom & Organization',
        points: 5,
        emoji: '🛌',
        difficulty: 'Easy',
        estimatedMinutes: 15
    },
    // Additional chores
    {
        name: 'Pick up mail',
        category: 'Shopping & Errands',
        points: 2,
        emoji: '📬',
        difficulty: 'Easy',
        estimatedMinutes: 10
    },
    {
        name: 'Walk the dog',
        category: 'Shopping & Errands',
        points: 5,
        emoji: '🐕',
        difficulty: 'Easy',
        estimatedMinutes: 20
    },
    {
        name: 'Empty dishwasher',
        category: 'Kitchen & Dining',
        points: 3,
        emoji: '🍽️',
        difficulty: 'Easy',
        estimatedMinutes: 10
    },
    {
        name: 'Dust furniture',
        category: 'Cleaning & Maintenance',
        points: 6,
        emoji: '🪑',
        difficulty: 'Medium',
        estimatedMinutes: 20
    },
    {
        name: 'Clean stove',
        category: 'Kitchen & Dining',
        points: 7,
        emoji: '🔥',
        difficulty: 'Medium',
        estimatedMinutes: 15
    },
    {
        name: 'Mop floors',
        category: 'Cleaning & Maintenance',
        points: 10,
        emoji: '🧼',
        difficulty: 'Medium',
        estimatedMinutes: 30
    },
    {
        name: 'Iron clothes',
        category: 'Laundry & Clothes',
        points: 6,
        emoji: '👔',
        difficulty: 'Medium',
        estimatedMinutes: 20
    },
    {
        name: 'Take out recycling',
        category: 'Cleaning & Maintenance',
        points: 3,
        emoji: '♻️',
        difficulty: 'Easy',
        estimatedMinutes: 5
    }
];

/**
 * Seed chore templates to the database
 */
async function seedChoreTemplates() {
    try {
        // Check if templates already exist
        const existingCount = await ChoreTemplate.countDocuments();
        if (existingCount > 0) {
            console.log(`Found ${existingCount} existing chore templates. Skipping seed.`);
            return;
        }

        // Insert templates
        await ChoreTemplate.insertMany(choreTemplates);
        console.log(`Successfully seeded ${choreTemplates.length} chore templates to the marketplace!`);
    } catch (error) {
        console.error('Error seeding chore templates:', error);
        throw error;
    }
}

module.exports = {
    choreTemplates,
    seedChoreTemplates
};