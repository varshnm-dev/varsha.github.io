const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Household = require('../models/household.model');

/**
 * Generate JWT token
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

/**
 * Create and send JWT token response
 */
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            user
        }
    });
};

/**
 * Register a new user
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password, householdId } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Check if household exists if provided
        let household;
        if (householdId) {
            household = await Household.findById(householdId);
            if (!household) {
                return res.status(404).json({
                    success: false,
                    message: 'Household not found'
                });
            }
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password,
            household: householdId || null,
            role: !householdId ? 'admin' : 'member' // First user is admin if creating new household
        });

        // Add user to household members if joining existing household
        if (household) {
            household.members.push(newUser._id);
            await household.save();
        }

        createSendToken(newUser, 201, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists & password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.checkPassword(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect email or password'
            });
        }

        // Update last active
        user.lastActive = Date.now();
        await user.save({ validateBeforeSave: false });

        // If everything is OK, send token to client
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get current user profile
 */
exports.getMe = async (req, res) => {
    try {
        // User is already available from protect middleware
        const user = await User.findById(req.user.id)
            .populate('household')
            .populate('achievements');

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update password
 */
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, passwordConfirm } = req.body;

        // Check if passwords provided
        if (!currentPassword || !newPassword || !passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current password and new password'
            });
        }

        // Check if new passwords match
        if (newPassword !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Check if current password is correct
        if (!(await user.checkPassword(currentPassword, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Log user in with new token
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update user profile
 */
exports.updateMe = async (req, res) => {
    try {
        // Check if user is trying to update password
        if (req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'This route is not for password updates. Please use /update-password'
            });
        }

        // Filter unwanted fields
        const filteredBody = {};
        const allowedFields = ['username', 'email', 'avatar'];
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredBody[key] = req.body[key];
            }
        });

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            filteredBody,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: {
                user: updatedUser
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
