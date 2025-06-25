const express = require('express');
const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { DeliveryManager } = require('../../../database/src');

const router = express.Router();

// Create delivery record for an order
const createDelivery = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      orderId,
      delivery_address,
      s_firstname,
      s_lastname,
      s_phone,
      city,
      delivery_status = 'pending',
      estimated_time
    } = req.body;

    // Create delivery record
    const result = await DeliveryManager.createDeliveryRecord(orderId, {
      delivery_address,
      s_firstname,
      s_lastname,
      s_phone,
      city,
      delivery_status,
      estimated_time
    });

    if (!result.success) {
      return res.status(500).json({
        error: 'Database error',
        message: result.error || 'Failed to create delivery record'
      });
    }

    res.status(201).json({
      message: 'Delivery record created successfully',
      delivery: result.delivery
    });
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create delivery record'
    });
  }
};

// Get delivery information by order ID
const getDeliveryByOrderId = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId } = req.params;
    
    const delivery = await DeliveryManager.getDeliveryByOrderId(orderId);
    
    if (!delivery) {
      return res.status(404).json({
        error: 'Delivery not found',
        message: 'No delivery record found for this order'
      });
    }

    res.json({
      message: 'Delivery retrieved successfully',
      delivery
    });
  } catch (error) {
    console.error('Get delivery error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch delivery'
    });
  }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId } = req.params;
    const { delivery_status, estimated_time } = req.body;
    
    const result = await DeliveryManager.updateDeliveryStatus(
      orderId, 
      delivery_status, 
      estimated_time
    );
    
    if (!result.success) {
      if (result.message === 'Delivery record not found') {
        return res.status(404).json({
          error: 'Delivery not found',
          message: 'No delivery record found for this order'
        });
      }
      return res.status(500).json({
        error: 'Database error',
        message: result.error || 'Failed to update delivery status'
      });
    }

    res.json({
      message: 'Delivery status updated successfully',
      delivery: result.delivery
    });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update delivery status'
    });
  }
};

// Validation rules for creating delivery
const createDeliveryValidation = [
  body('orderId')
    .isNumeric()
    .withMessage('Order ID must be a number'),
  
  body('delivery_address')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Delivery address is required'),
  
  body('s_firstname')
    .isString()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  
  body('s_lastname')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  
  body('s_phone')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Phone number is required'),
  
  body('city')
    .isString()
    .isLength({ min: 1 })
    .withMessage('City is required'),

  body('delivery_status')
    .optional()
    .isString()
    .withMessage('Delivery status must be a string'),

  body('estimated_time')
    .optional()
    .isISO8601()
    .withMessage('Estimated time must be a valid date')
];

// Validation rules for updating delivery status
const updateDeliveryValidation = [
  param('orderId')
    .isNumeric()
    .withMessage('Order ID must be a number'),
  
  body('delivery_status')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Delivery status is required'),

  body('estimated_time')
    .optional()
    .isISO8601()
    .withMessage('Estimated time must be a valid date')
];

// Validation rules for getting delivery by order ID
const orderIdValidation = [
  param('orderId')
    .isNumeric()
    .withMessage('Order ID must be a number')
];

// Routes
router.post('/', authMiddleware, createDeliveryValidation, createDelivery);
router.get('/order/:orderId', authMiddleware, orderIdValidation, getDeliveryByOrderId);
router.patch('/order/:orderId/status', authMiddleware, updateDeliveryValidation, updateDeliveryStatus);

module.exports = router;
