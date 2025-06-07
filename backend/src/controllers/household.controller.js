const Household = require('../models/household.model');
const User = require('../models/user.model');
const Chore = require('../models/chore.model');
const crypto = require('crypto');

/**
 * Create a new household
 */
exports.createHousehold = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if user already has a household
        if (req.user.household) {
            return res.status(400).json({
                success: false,
                message: 'You already belong to a household. Leave your current household before creating a new one.'
            });
        }

        // Create new household
        const newHousehold = await Household.create({
            name,
            admin: req.user.id,
            members: [req.user.id]
        });

        // Update user with household and admin role
        req.user.household = newHousehold.id;
        req.user.role = 'admin';
        await req.user.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            data: {
                household: newHousehold
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
 * Join an existing household with invite code
 */
exports.joinHousehold = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        // Check if invite code exists
        const household = await Household.findOne({ inviteCode });
        if (!household) {
            return res.status(404).json({
                success: false,
                message: 'Invalid invite code. Please check and try again.'
            });
        }

        // Check if user already has a household
        if (req.user.household) {
            return res.status(400).json({
                success: false,
                message: 'You already belong to a household. Leave your current household before joining a new one.'
            });
        }

        // Add user to household
        household.members.push(req.user.id);
        await household.save();

        // Update user with household
        req.user.household = household.id;
        req.user.role = 'member'; // Default role for joining members
        await req.user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: {
                household
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
 * Get user's current household
 */
exports.getMyHousehold = async (req, res) => {
    try {
        // Check if user has a household
        if (!req.user.household) {
            return res.status(404).json({
                success: false,
                message: 'You do not belong to any household yet.'
            });
        }

        // Get household with populated members
        const household = await Household.findById(req.user.household)
            .populate({
                path: 'members',
                select: 'username avatar points role'
            })
            .populate({
                path: 'admin',
                select: 'username avatar'
            });

        if (!household) {
            return res.status(404).json({
                success: false,
                message: 'Household not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                household
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
 * Get a specific household by ID
 */
exports.getHousehold = async (req, res) => {
    try {
        const { householdId } = req.params;

        const household = await Household.findById(householdId)
            .populate({
                path: 'members',
                select: 'username avatar points role'
            })
            .populate({
                path: 'admin',
                select: 'username avatar'
            });

        if (!household) {
            return res.status(404).json({
                success: false,
                message: 'Household not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                household
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
 * Update a household (admin only)
 */
exports.updateHousehold = async (req, res) => {
    try {
        const { householdId } = req.params;

        // Filter unwanted fields
        const filteredBody = {};
        const allowedFields = ['name', 'pointMultiplier', 'weeklyResetDay'];
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredBody[key] = req.body[key];
            }
        });

        // Update household
        const updatedHousehold = await Household.findByIdAndUpdate(
            householdId,
            filteredBody,
            {
                new: true,
                runValidators: true
            }
        ).populate({
            path: 'members',
            select: 'username avatar points role'
        });

        res.status(200).json({
            success: true,
            data: {
                household: updatedHousehold
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
 * Delete a household (admin only)
 */
exports.deleteHousehold = async (req, res) => {
    try {
        const { householdId } = req.params;

        // Delete household
        await Household.findByIdAndDelete(householdId);

        // Update all users in household to remove household reference
        await User.updateMany(
            { household: householdId },
            { household: null, role: 'member' }
        );

        // Delete all chores in this household
        await Chore.deleteMany({ household: householdId });

        res.status(204).json({
            success: true,
            data: null
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Add a member to household (admin only)
 */
exports.addMember = async (req, res) => {
    try {
        const { householdId } = req.params;
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that email'
            });
        }

        // Check if user already has a household
        if (user.household) {
            return res.status(400).json({
                success: false,
                message: 'User already belongs to a household'
            });
        }

        // Find household
        const household = await Household.findById(householdId);

        // Add user to household members
        household.members.push(user.id);
        await household.save();

        // Update user with household
        user.household = householdId;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: {
                household
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
 * Remove a member from household (admin only)
 */
exports.removeMember = async (req, res) => {
    try {
        const { householdId, userId } = req.params;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that ID'
            });
        }

        // Check if user is in this household
        if (user.household.toString() !== householdId) {
            return res.status(400).json({
                success: false,
                message: 'User is not a member of this household'
            });
        }

        // Check if user is the admin (admin cannot be removed)
        const household = await Household.findById(householdId);
        if (user.id === household.admin.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove the household admin. Transfer admin role first or delete the household.'
            });
        }

        // Remove user from household members
        household.members = household.members.filter(
            member => member.toString() !== userId
        );
        await household.save();

        // Update user to remove household
        user.household = null;
        user.role = 'member'; // Reset role
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            data: {
                household
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
 * Generate new invite code (admin only)
 */
exports.generateInviteCode = async (req, res) => {
    try {
        const { householdId } = req.params;

        // Generate new invite code
        const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        // Update household
        const household = await Household.findByIdAndUpdate(
            householdId,
            { inviteCode },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                inviteCode: household.inviteCode
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
