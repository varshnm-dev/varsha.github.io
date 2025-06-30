const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const choreRoutes = require('./src/routes/chore.routes');
const choreTemplateRoutes = require('./src/routes/choreTemplate.routes');
const householdRoutes = require('./src/routes/household.routes');
const completedChoreRoutes = require('./src/routes/completedChore.routes');
const achievementRoutes = require('./src/routes/achievement.routes');
const leaderboardRoutes = require('./src/routes/leaderboard.routes');

// Create Express app
const app = express();

// Set up rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

// Configure CORS for production
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ].filter(Boolean);
        
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // Enable CORS with options
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // HTTP request logger
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(limiter); // Apply rate limiting

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chores', choreRoutes);
app.use('/api/chore-templates', choreTemplateRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/completed-chores', completedChoreRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Household Gamification API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
