const ChoreTemplate = require('../models/choreTemplate.model');
const { seedChoreTemplates } = require('../seeds/choreTemplates');

/**
 * Get all active chore templates for marketplace
 */
exports.getAllTemplates = async (req, res) => {
    try {
        // Auto-seed templates if they don't exist
        const existingCount = await ChoreTemplate.countDocuments();
        if (existingCount === 0) {
            await seedChoreTemplates();
        }

        const { category, search } = req.query;
        
        // Build query
        let query = { isActive: true };
        
        // Filter by category if provided
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Search in name and description if provided
        if (search) {
            query.$text = { $search: search };
        }
        
        const templates = await ChoreTemplate.find(query)
            .sort({ category: 1, points: 1, name: 1 });
        
        res.status(200).json({
            success: true,
            results: templates.length,
            data: {
                templates
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
 * Get chore templates grouped by category
 */
exports.getTemplatesByCategory = async (req, res) => {
    try {
        // Auto-seed templates if they don't exist
        const existingCount = await ChoreTemplate.countDocuments();
        if (existingCount === 0) {
            await seedChoreTemplates();
        }

        const templates = await ChoreTemplate.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    chores: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            description: '$description',
                            points: '$points',
                            emoji: '$emoji',
                            difficulty: '$difficulty',
                            estimatedMinutes: '$estimatedMinutes'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                categories: templates
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
 * Get single chore template
 */
exports.getTemplate = async (req, res) => {
    try {
        const template = await ChoreTemplate.findById(req.params.id);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Chore template not found'
            });
        }
        
        if (!template.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Chore template is not available'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                template
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
 * Create new chore template (admin only - for managing marketplace)
 */
exports.createTemplate = async (req, res) => {
    try {
        const template = await ChoreTemplate.create(req.body);
        
        res.status(201).json({
            success: true,
            data: {
                template
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
 * Update chore template (admin only - for managing marketplace)
 */
exports.updateTemplate = async (req, res) => {
    try {
        const template = await ChoreTemplate.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Chore template not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {
                template
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
 * Delete/deactivate chore template (admin only - for managing marketplace)
 */
exports.deleteTemplate = async (req, res) => {
    try {
        const template = await ChoreTemplate.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Chore template not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Chore template deactivated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};