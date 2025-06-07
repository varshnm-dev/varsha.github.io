const mongoose = require('mongoose');
const User = require('../models/user.model');
const Household = require('../models/household.model');
const Chore = require('../models/chore.model');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

// Sample chores from original Excel sheet
const originalChores = [
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
        emoji: '🧺',
        difficulty: 'Medium',
        estimatedMinutes: 20
    },
    {
        name: 'Clean refrigerator',
        category: 'Kitchen & Dining',
        points: 8,
        emoji: '❄️',
        difficulty: 'Medium',
        estimatedMinutes: 25
    },
    {
        name: 'Organize closet',
        category: 'Bedroom & Organization',
        points: 9,
        emoji: '👚',
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
    }
];

// Additional chores to add
const additionalChores = [
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

// Combine all chores
const allChores = [...originalChores, ...additionalChores];

// Seed data function
const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Household.deleteMany({});
        await Chore.deleteMany({});

        console.log('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            points: 0
        });

        console.log('Created admin user');

        // Create household
        const household = await Household.create({
            name: 'Demo Household',
            admin: adminUser._id,
            members: [adminUser._id],
            inviteCode: 'DEMO123'
        });

        console.log('Created household');

        // Update admin user with household
        adminUser.household = household._id;
        await adminUser.save({ validateBeforeSave: false });

        // Create member user
        const memberUser = await User.create({
            username: 'member',
            email: 'member@example.com',
            password: 'password123',
            role: 'member',
            household: household._id,
            points: 0
        });

        console.log('Created member user');

        // Add member to household
        household.members.push(memberUser._id);
        await household.save();

        // Create chores
        for (const chore of allChores) {
            await Chore.create({
                ...chore,
                household: household._id
            });
        }

        console.log(`Created ${allChores.length} chores`);

        console.log('Database seeded successfully!');
        console.log('');
        console.log('Login with:');
        console.log('Admin: admin@example.com / password123');
        console.log('Member: member@example.com / password123');
        console.log('');

        // Disconnect from database
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed function
seedData();
