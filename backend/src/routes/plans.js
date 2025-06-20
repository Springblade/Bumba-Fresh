const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation rules for plan operations
const createPlanValidation = [
  body('subscriptionPlan')
    .isIn(['basic', 'premium', 'signature'])
    .withMessage('Invalid subscription plan type'),
  
  body('mealsPerWeek')
    .isInt({ min: 1, max: 10 })
    .withMessage('Meals per week must be between 1 and 10'),
  
  body('pricePerMeal')
    .isFloat({ min: 0 })
    .withMessage('Price per meal must be a positive number'),
  
  body('billingCycle')
    .isIn(['weekly', 'monthly'])
    .withMessage('Billing cycle must be weekly or monthly')
];

// All plan routes require authentication
router.use(authMiddleware);

// Placeholder endpoints - to be implemented later
router.get('/', (req, res) => {
  res.json({
    message: 'Plans endpoint - coming soon',
    endpoint: '/api/plans'
  });
});

router.post('/', createPlanValidation, (req, res) => {
  res.json({
    message: 'Create plan endpoint - coming soon',
    endpoint: 'POST /api/plans'
  });
});

router.get('/:id', (req, res) => {
  res.json({
    message: 'Get plan by ID endpoint - coming soon',
    endpoint: 'GET /api/plans/:id'
  });
});

module.exports = router;
