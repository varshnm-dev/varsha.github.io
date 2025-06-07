const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Middleware for protecting routes that require authentication
 */
exports.protect = async (req, res, next) => {
    try {
        // 1) Check if token exists
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'You are not logged in. Please log in to get access.'
            });
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'The user belonging to this token no longer exists.'
            });
        }

        // 4) Add user to request object
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Your token has expired. Please log in again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Authentication failed. Please log in again.'
        });
    }
};

/**
 * Middleware to restrict access based on user roles
 * @param  {...String} roles - Array of allowed roles
 */
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array, e.g. ['admin', 'member']
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.'
            });
        }
        next();
    };
};

/**
 * Middleware to ensure user is in same household as resource
 */
exports.restrictToSameHousehold = async (req, res, next) => {
    try {
        // Check if user has a household
        if (!req.user.household) {
            return res.status(403).json({
                success: false,
                message: 'You must be part of a household to access this resource.'
            });
        }

        // For requests with householdId in params
        if (req.params.householdId && req.params.householdId !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only access resources in your own household.'
            });
        }

        // If there's an item with a household property in the body
        if (req.body.household && req.body.household !== req.user.household.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only create resources in your own household.'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
