const express = require('express');
const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { OrderManager, MealOrderManager, DeliveryManager } = require('../../../database/src');

const router = express.Router();

// Get all orders for the authenticated user
const getAllOrders = async (req, res) => {
  try {
    console.log(' Getting orders for user:', req.user?.id);
    const userId = req.user.id;
    const result = await OrderManager.getOrdersByUserId(userId);
    
    console.log(' Order query result:', {
      success: result.success,
      orderCount: result.orders?.length || 0,
      message: result.message
    });
    
    if (!result.success) {
      console.error(' Database error in getAllOrders:', result.message);
      return res.status(500).json({
        error: 'Database error',
        message: result.message
      });
    }

    console.log(' Returning orders:', result.orders);
    res.json({
      message: 'Orders retrieved successfully',
      orders: result.orders || []
    });
  } catch (error) {
    console.error(' Get orders error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch orders'
    });
  }
};

// Get delivery information for a specific order
const getOrderDelivery = async (req, res) => {
  try {
    console.log(' DEBUG: getOrderDelivery called');
    console.log(' DEBUG: req.params:', req.params);
    console.log(' DEBUG: req.user:', req.user);
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const orderId = parseInt(req.params.id);
    const userId = req.user.id;
    
    console.log(' DEBUG: Parsed orderId:', orderId, 'userId:', userId);

    // First verify that this order belongs to the user
    const orderResult = await OrderManager.getOrderByIdAndUserId(orderId, userId);
    
    if (!orderResult.success) {
      console.log(' DEBUG: Order verification failed:', orderResult.message);
      return res.status(404).json({
        error: 'Order not found',
        message: orderResult.message
      });
    }

    // Get delivery information
    const deliveryResult = await DeliveryManager.getDeliveryByOrderId(orderId);
    
    if (!deliveryResult.success) {
      console.log(' DEBUG: Delivery fetch failed:', deliveryResult.message);
      return res.status(404).json({
        error: 'Delivery information not found',
        message: deliveryResult.message
      });
    }

    console.log(' DEBUG: Returning delivery info:', deliveryResult.delivery);
    res.json({
      message: 'Delivery information retrieved successfully',
      delivery: deliveryResult.delivery
    });
  } catch (error) {
    console.error(' DEBUG: Exception in getOrderDelivery:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch delivery information'
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    console.log(' DEBUG: getOrderById called');
    console.log(' DEBUG: req.params:', req.params);
    console.log(' DEBUG: req.user:', req.user);
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(' DEBUG: Validation errors:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    
    console.log(' DEBUG: Looking for order ID:', id, 'for user ID:', userId);
    
    const result = await OrderManager.getOrderByIdAndUserId(id, userId);
    
    console.log(' DEBUG: OrderManager result:', result);
    
    if (!result.success) {
      if (result.message === 'Order not found') {
        console.log(' DEBUG: Order not found for user');
        return res.status(404).json({
          error: 'Order not found',
          message: 'Order does not exist or does not belong to you'
        });
      }
      console.log(' DEBUG: Database error:', result.message);
      return res.status(500).json({
        error: 'Database error',
        message: result.message
      });
    }

    console.log(' DEBUG: Returning order:', result.order);
    res.json({
      message: 'Order retrieved successfully',
      order: result.order
    });
  } catch (error) {
    console.error(' DEBUG: Exception in getOrderById:', error);
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

// Complete order with shipping information and payment
const completeOrder = async (req, res) => {
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
      totalAmount, 
      items, 
      shippingAddress,
      paymentMethod 
    } = req.body;
    const userId = req.user.id;
    
    // Create the order
    const orderResult = await OrderManager.addOrder(userId, totalAmount, 'confirmed');
    
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

    // Create delivery record with shipping information
    const deliveryInfo = {
      delivery_address: shippingAddress.address,
      s_firstname: shippingAddress.firstName,
      s_lastname: shippingAddress.lastName,
      s_phone: shippingAddress.phoneNumber,
      city: shippingAddress.city,
      delivery_status: 'pending',
      estimated_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    };

    const deliveryResult = await DeliveryManager.createDeliveryRecord(orderId, deliveryInfo);
    
    if (!deliveryResult.success) {
      console.error('Failed to create delivery record:', deliveryResult.message);
    }

    // Get the complete order with items
    const completeOrderResult = await OrderManager.getOrderByIdAndUserId(orderId, userId);

    res.status(201).json({
      message: 'Order completed successfully',
      order: completeOrderResult.success ? completeOrderResult.order : orderResult.order,
      orderNumber: `ORD-${orderId.toString().padStart(6, '0')}`
    });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to complete order'
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

// Validation rules for completing orders
const completeOrderValidation = [
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
    .withMessage('Price must be a positive number'),
  
  body('shippingAddress.firstName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name is required'),
  
  body('shippingAddress.lastName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Last name is required'),
  
  body('shippingAddress.phoneNumber')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Phone number is required'),
  
  body('shippingAddress.address')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Address is required'),
  
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 1 })
    .withMessage('City is required'),
    body('shippingAddress.postalCode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Postal code is required'),
  
  body('paymentMethod')
    .isIn(['credit-card', 'paypal'])
    .withMessage('Invalid payment method')
];

// Validation rules
const orderIdValidation = [
  param('id')
    .isNumeric()
    .withMessage('Order ID must be a number')
];

// Get meals for a specific order
const getOrderMeals = async (req, res) => {
  try {
    console.log(' DEBUG: getOrderMeals called');
    console.log(' DEBUG: req.params:', req.params);
    console.log(' DEBUG: req.user:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(' DEBUG: Validation errors in getOrderMeals:', errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;
    
    console.log(' DEBUG: Looking for meals for order ID:', id, 'for user ID:', userId);
    
    // First verify the order belongs to the user
    const orderResult = await OrderManager.getOrderByIdAndUserId(id, userId);
    
    console.log(' DEBUG: Order verification result:', orderResult);
    
    if (!orderResult.success) {
      if (orderResult.message === 'Order not found') {
        console.log(' DEBUG: Order not found in getOrderMeals');
        return res.status(404).json({
          error: 'Order not found',
          message: 'Order does not exist or does not belong to you'
        });
      }
      console.log(' DEBUG: Database error in getOrderMeals:', orderResult.message);
      return res.status(500).json({
        error: 'Database error',
        message: orderResult.message
      });
    }

    // Get meals for the order
    const meals = await MealOrderManager.getMealsByOrderId(id);
    
    console.log(' DEBUG: Meals retrieved:', meals);
    
    res.json({
      message: 'Order meals retrieved successfully',
      meals: meals
    });
  } catch (error) {
    console.error(' DEBUG: Exception in getOrderMeals:', error);
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
router.post('/complete', authMiddleware, completeOrderValidation, completeOrder);
router.get('/:id/delivery', authMiddleware, orderIdValidation, getOrderDelivery);

module.exports = router;
