const express = require('express');
const { body, param, query } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters'),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters')
];

// Routes (all protected)
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateProfileValidation, updateUserProfile);

module.exports = router;
