const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { PlanManager } = require('../../../database/src');

const router = express.Router();

// Create subscription
const createSubscription = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { subscriptionPlan, timeExpired } = req.body;
    const userId = req.user.id;
    
    // Create the subscription using existing PlanManager
    const result = await PlanManager.addPlan(subscriptionPlan, timeExpired, userId);
    
    if (!result.success) {
      return res.status(500).json({
        error: 'Database error',
        message: result.error || 'Failed to create subscription'
      });
    }

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription: result.plan,
      subscriptionNumber: `SUB-${result.plan.plan_id.toString().padStart(6, '0')}`
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create subscription'
    });
  }
};

// Validation rules for creating subscriptions
const createSubscriptionValidation = [
  body('subscriptionPlan')
    .isString()
    .isIn(['basic', 'premium', 'signature'])
    .withMessage('Subscription plan must be basic, premium, or signature'),
  
  body('timeExpired')
    .isISO8601()
    .withMessage('Time expired must be a valid date')
];

// Routes
router.post(
  '/', 
  authMiddleware, 
  createSubscriptionValidation,
  createSubscription
);

module.exports = router;