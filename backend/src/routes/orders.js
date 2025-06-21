const express = require('express');
const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { OrderManager, MealOrderManager } = require('../../../database/src');

const router = express.Router();

// Get all orders for the authenticated user
const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await OrderManager.getOrdersByUserId(userId);
    
    if (!result.success) {
      return res.status(500).json({
        error: 'Database error',
        message: result.message
      });
    }

    res.json({
      message: 'Orders retrieved successfully',
      orders: result.orders || []
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch orders'
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await OrderManager.getOrderByIdAndUserId(id, userId);
    
    if (!result.success) {
      if (result.message === 'Order not found') {
        return res.status(404).json({
          error: 'Order not found',
          message: 'Order does not exist or does not belong to you'
        });
      }
      return res.status(500).json({
        error: 'Database error',
        message: result.message
      });
    }

    res.json({
      message: 'Order retrieved successfully',
      order: result.order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order'
    });
  }
};

const createOrder = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { totalAmount, items } = req.body;
    const userId = req.user.id;
    
    // Create the order
    const orderResult = await OrderManager.addOrder(userId, totalAmount, 'pending');
    
    if (!orderResult.success) {
      return res.status(500).json({
        error: 'Database error',
        message: orderResult.message
      });
    }

    const orderId = orderResult.order.order_id;

    // Add items to the order
    if (items && items.length > 0) {
      for (const item of items) {
        const mealOrderResult = await MealOrderManager.addMealToOrder(
          orderId, 
          item.mealId, 
          item.quantity, 
          item.price
        );
        
        if (!mealOrderResult.success) {
          console.error('Failed to add meal to order:', mealOrderResult.message);
        }
      }
    }

    // Get the complete order with items
    const completeOrderResult = await OrderManager.getOrderByIdAndUserId(orderId, userId);

    res.status(201).json({
      message: 'Order created successfully',
      order: completeOrderResult.success ? completeOrderResult.order : orderResult.order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create order'
    });
  }
};

// Validation rules for creating orders
const createOrderValidation = [
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items array is required and must not be empty'),
  
  body('items.*.mealId')
    .isNumeric()
    .withMessage('Meal ID must be a number'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

// Validation rules
const orderIdValidation = [  param('id')
    .isNumeric()
    .withMessage('Order ID must be a number')
];

// Get meals for a specific order
const getOrderMeals = async (req, res) => {
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
    
    // First verify the order belongs to the user
    const orderResult = await OrderManager.getOrderByIdAndUserId(id, userId);
    
    if (!orderResult.success) {
      if (orderResult.message === 'Order not found') {
        return res.status(404).json({
          error: 'Order not found',
          message: 'Order does not exist or does not belong to you'
        });
      }
      return res.status(500).json({
        error: 'Database error',
        message: orderResult.message
      });
    }

    // Get meals for the order
    const meals = await MealOrderManager.getMealsByOrderId(id);
    
    res.json({
      message: 'Order meals retrieved successfully',
      meals: meals
    });
  } catch (error) {
    console.error('Get order meals error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order meals'
    });
  }
};

// Routes
router.get('/', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware, orderIdValidation, getOrderById);
router.get('/:id/meals', authMiddleware, orderIdValidation, getOrderMeals);
router.post('/', authMiddleware, createOrderValidation, createOrder);

module.exports = router;
