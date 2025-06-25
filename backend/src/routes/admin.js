const express = require('express');
const { OrderManager, MealOrderManager } = require('../../../database/src');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware to check admin privileges
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required'
    });
  }
  next();
};

/**
 * GET /api/admin/stats
 * Get dashboard statistics for admin
 */
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log(' Admin stats endpoint called');
    console.log(' User info:', req.user);

    const { UserStatsManager } = require('../../../database/src');
    console.log(' UserStatsManager loaded');
    
    // Get user statistics
    console.log(' Fetching user stats...');
    const userStats = await UserStatsManager.getUserStats();
    console.log(' User stats:', userStats);
    
    // Get total orders  
    console.log(' Fetching total orders...');
    const totalOrderStats = await UserStatsManager.getTotalOrder();
    console.log(' Total order stats:', totalOrderStats);
    
    // Get average order value statistics
    console.log(' Fetching avg order value...');
    const avgOrderStats = await UserStatsManager.getAvgOrderVal();
    console.log(' Avg order stats:', avgOrderStats);

    // Calculate changes (simulate weekly change) -5% to +5%
    const customersChange = Math.random() * 10 - 5;
    const averageOrderChange = Math.random() * 10 - 5; 
    const ordersChange = Math.random() * 10 - 5;     
    console.log(' Simulated changes:', { customersChange, averageOrderChange, ordersChange });

    const stats = {
      activeCustomers: userStats.totalUsers,
      ordersThisWeek: totalOrderStats.totalOrders,
      averageOrderValue: avgOrderStats.avgOrderValue,
      totalRevenue: avgOrderStats.totalRevenue,
      percentChange: {
        customers: Math.round(customersChange * 100) / 100,
        orders: Math.round(ordersChange * 100) / 100,
        averageOrder: Math.round(averageOrderChange * 100) / 100,
      }
    };

    console.log(' Final calculated stats:', stats);

    res.json({
      message: 'Admin stats retrieved successfully',
      stats
    });
  } catch (error) {
    console.error(' Error fetching admin stats:', error);
    console.error(' Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch admin statistics',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/test-stats (temporary for debugging)
 * Test stats endpoint without auth requirements
 */
router.get('/test-stats', async (req, res) => {
  try {
    console.log(' Test stats endpoint called (no auth required)');

    const { UserStatsManager } = require('../../../database/src');
    console.log(' UserStatsManager loaded');
    
    // Get user statistics
    console.log(' Fetching user stats...');
    const userStats = await UserStatsManager.getUserStats();
    console.log(' User stats:', userStats);
    
    // Get total orders  
    console.log(' Fetching total orders...');
    const totalOrderStats = await UserStatsManager.getTotalOrder();
    console.log(' Total order stats:', totalOrderStats);
    
    // Get average order value statistics
    console.log(' Fetching avg order value...');
    const avgOrderStats = await UserStatsManager.getAvgOrderVal();
    console.log(' Avg order stats:', avgOrderStats);

    // Calculate changes (simulate weekly change) -5% to +5%
    const customersChange = Math.random() * 10 - 5;
    const averageOrderChange = Math.random() * 10 - 5; 
    const ordersChange = Math.random() * 10 - 5;     
    
    const stats = {
      activeCustomers: userStats.totalUsers,
      ordersThisWeek: totalOrderStats.totalOrders,
      averageOrderValue: avgOrderStats.avgOrderValue,
      totalRevenue: avgOrderStats.totalRevenue,
      percentChange: {
        customers: Math.round(customersChange * 100) / 100,
        orders: Math.round(ordersChange * 100) / 100,
        averageOrder: Math.round(averageOrderChange * 100) / 100,
      }
    };

    console.log(' Final calculated test stats:', stats);

    res.json({
      message: 'Test admin stats retrieved successfully',
      stats
    });
  } catch (error) {
    console.error(' Error fetching test admin stats:', error);
    console.error(' Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch test admin statistics',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/orders
 * Get all orders for admin view
 */
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    console.log(' Fetching admin orders with filters:', { status });

    // Use UserStatsManager to get orders
    const { UserStatsManager } = require('../../../database/src');
    const orders = await UserStatsManager.getOrders();
      // Filter by status if provided
    const filteredOrders = status && status !== 'all' 
      ? orders.filter(order => order.status === status)
      : orders;
    
    // Transform the data to match expected format
    const transformedOrders = filteredOrders.map(order => {
      // Map database status to frontend expected status
      let frontendStatus = order.status;
      switch(order.status) {
        case 'confirmed':
        case 'pending':
        case 'preparing':
          frontendStatus = 'processing';
          break;
        case 'shipped':
          frontendStatus = 'shipped';
          break;
        case 'delivered':
          frontendStatus = 'delivered';
          break;
        case 'cancelled':
          frontendStatus = 'cancelled';
          break;
        default:
          frontendStatus = 'processing';
      }
      
      return {
        id: order.orderId,
        customer: order.customerName,
        email: order.customerEmail,
        date: new Date(order.orderDate).toLocaleDateString(),
        items: order.totalItems,
        total: `$${order.totalPrice.toFixed(2)}`,
        status: frontendStatus
      };
    });

    res.json({
      message: 'Admin orders retrieved successfully',
      orders: transformedOrders
    });
  } catch (error) {
    console.error(' Error fetching admin orders:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch admin orders'
    });
  }
});

/**
 * GET /api/admin/test-orders (temporary for debugging)
 * Test orders endpoint without auth requirements
 */
router.get('/test-orders', async (req, res) => {
  try {
    const { status } = req.query;
    console.log(' Test orders endpoint called (no auth required) with filters:', { status });

    // Use UserStatsManager to get orders
    const { UserStatsManager } = require('../../../database/src');
    console.log(' UserStatsManager loaded for orders');
    
    const orders = await UserStatsManager.getOrders();
    console.log(' Raw orders from database:', orders);
    
    // Filter by status if provided
    const filteredOrders = status && status !== 'all' 
      ? orders.filter(order => order.status === status)
      : orders;
    
    console.log(' Filtered orders:', filteredOrders);
      // Transform the data to match expected format
    const transformedOrders = filteredOrders.map(order => {
      // Map database status to frontend expected status
      let frontendStatus = order.status;
      switch(order.status) {
        case 'confirmed':
        case 'pending':
        case 'preparing':
          frontendStatus = 'processing';
          break;
        case 'shipped':
          frontendStatus = 'shipped';
          break;
        case 'delivered':
          frontendStatus = 'delivered';
          break;
        case 'cancelled':
          frontendStatus = 'cancelled';
          break;
        default:
          frontendStatus = 'processing';
      }
      
      return {
        id: order.orderId,
        customer: order.customerName,
        email: order.customerEmail,
        date: new Date(order.orderDate).toLocaleDateString(),
        items: order.totalItems,
        total: `$${order.totalPrice.toFixed(2)}`,
        status: frontendStatus
      };
    });

    console.log(' Final transformed orders:', transformedOrders);

    res.json({
      message: 'Test admin orders retrieved successfully',
      orders: transformedOrders
    });
  } catch (error) {
    console.error(' Error fetching test admin orders:', error);
    console.error(' Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch test admin orders',
      details: error.message
    });
  }
});

/**
 * GET /api/admin/customers
 * Get all customers for admin view
 */
router.get('/customers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log(' Fetching admin customers...');

    const { UserStatsManager } = require('../../../database/src');
    
    // Get all customers from the database
    const customers = await UserStatsManager.getCustomers();
    
    console.log(' Retrieved customers:', customers.length);

    res.json({
      message: 'Admin customers retrieved successfully',
      customers
    });
  } catch (error) {
    console.error(' Error fetching admin customers:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch admin customers'
    });
  }
});

/**
 * GET /api/admin/test-customers (temporary for debugging)
 * Test customers endpoint without auth requirements
 */
router.get('/test-customers', async (req, res) => {
  try {
    console.log(' Test customers endpoint called (no auth required)');

    const { UserStatsManager } = require('../../../database/src');
    console.log(' UserStatsManager loaded for customers');
    
    const customers = await UserStatsManager.getCustomers();
    console.log(' Raw customers from database:', customers);

    console.log(' Final customers data:', customers);

    res.json({
      message: 'Test admin customers retrieved successfully',
      customers
    });
  } catch (error) {
    console.error(' Error fetching test admin customers:', error);
    console.error(' Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch test admin customers',
      details: error.message
    });
  }
});



module.exports = router;
