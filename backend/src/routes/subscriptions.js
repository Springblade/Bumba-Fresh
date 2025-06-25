const express = require('express');
const { body, param, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { PlanManager } = require('../../../database/src');

const router = express.Router();

// Get user's active subscription
const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(' Getting subscription for user ID:', userId);
    
    // Get user's plans
    const plans = await PlanManager.getUserPlans(userId);
    
    console.log(' Found plans:', plans);
    
    if (!plans || plans.length === 0) {
      return res.json({
        message: 'No active subscription found',
        subscription: null
      });
    }
    
    // Get the most recent active subscription (not expired)
    const now = new Date();
    const activeSubscription = plans.find(plan => new Date(plan.time_expired) > now);
    
    if (!activeSubscription) {
      return res.json({
        message: 'No active subscription found',
        subscription: null
      });
    }
    
    // Transform the subscription data for frontend
    const subscriptionData = {
      plan_id: activeSubscription.plan_id,
      plan: activeSubscription.subscription_plan,
      status: 'active',
      nextBillingDate: activeSubscription.time_expired,
      nextDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      subscriptionPlan: activeSubscription.subscription_plan
    };
    
    console.log(' Returning subscription data:', subscriptionData);
    
    res.json({
      message: 'Subscription retrieved successfully',
      subscription: subscriptionData
    });
  } catch (error) {
    console.error(' Error getting user subscription:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch subscription'
    });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    
    console.log(' Cancelling subscription ID:', id, 'for user:', userId);
    
    // First verify the subscription belongs to the user
    const subscription = await PlanManager.getPlanById(id);
    
    if (!subscription || subscription.user_id !== userId) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'Subscription not found or does not belong to user'
      });
    }
    
    // Delete the subscription (cancel it)
    const result = await PlanManager.deletePlan(id);
    
    if (!result.success) {
      return res.status(500).json({
        error: 'Database error',
        message: result.error || 'Failed to cancel subscription'
      });
    }

    console.log(' Subscription cancelled successfully');
    
    res.json({
      message: 'Subscription cancelled successfully',
      cancelledSubscription: result.plan
    });
  } catch (error) {
    console.error(' Error cancelling subscription:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to cancel subscription'
    });
  }
};

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

// Validation rules for subscription ID parameter
const subscriptionIdValidation = [
  param('id')
    .isNumeric()
    .withMessage('Subscription ID must be a number')
];

// Routes
router.get('/', authMiddleware, getUserSubscription);
router.post('/', authMiddleware, createSubscriptionValidation, createSubscription);
router.delete('/:id', authMiddleware, subscriptionIdValidation, cancelSubscription);

module.exports = router;