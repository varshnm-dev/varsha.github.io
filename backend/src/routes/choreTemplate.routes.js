const express = require('express');
const {
    getAllTemplates,
    getTemplatesByCategory,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate
} = require('../controllers/choreTemplate.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes (accessible by authenticated users)
router.use(protect);

router.get('/', getAllTemplates);
router.get('/by-category', getTemplatesByCategory);
router.get('/:id', getTemplate);

// Admin only routes (for marketplace management)
router.use(restrictTo('admin'));
router.post('/', createTemplate);
router.patch('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

module.exports = router;