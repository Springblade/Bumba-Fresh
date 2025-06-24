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
    console.log('📊 Fetching admin dashboard stats...');

    // Get the date range for "this week"
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of this week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of this week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    // Get last week for comparison
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(weekStart.getDate() - 7);
    const lastWeekEnd = new Date(weekEnd);
    lastWeekEnd.setDate(weekEnd.getDate() - 7);

    console.log('📅 Date ranges:', {
      thisWeek: { start: weekStart, end: weekEnd },
      lastWeek: { start: lastWeekStart, end: lastWeekEnd }
    });

    // Fetch order statistics
    const orderStats = await OrderManager.getOrderStatistics();
    console.log('📊 Order stats:', orderStats);

    // Get orders this week
    const thisWeekOrders = await OrderManager.getAllOrders({
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString()
    });

    // Get orders last week for comparison
    const lastWeekOrders = await OrderManager.getAllOrders({
      startDate: lastWeekStart.toISOString(),
      endDate: lastWeekEnd.toISOString()
    });    // Get total revenue
    const totalRevenue = await OrderManager.getTotalRevenue();

    // Get real customer data from database
    const { UserStatsManager } = require('../../../database/src');
    const userStats = await UserStatsManager.getUserStats();
    const activeUserStats = await UserStatsManager.getActiveUserStats();
    const registrationTrends = await UserStatsManager.getRegistrationTrends();

    // Calculate metrics
    const ordersThisWeek = thisWeekOrders.length;
    const ordersLastWeek = lastWeekOrders.length;
    const averageOrderValue = parseFloat(orderStats.average_order_value) || 0;

    // Calculate percentage changes
    const ordersChange = ordersLastWeek > 0 
      ? ((ordersThisWeek - ordersLastWeek) / ordersLastWeek) * 100 
      : 0;

    // Use real customer data instead of simulated
    const activeCustomers = activeUserStats.activeUsers || userStats.totalUsers;
    const customersChange = registrationTrends.weeklyChange;

    // Calculate average order change (simulate for demo)
    const averageOrderChange = Math.random() * 10 - 5; // -5% to +5%

    const stats = {
      activeCustomers,
      ordersThisWeek,
      averageOrderValue,
      totalRevenue,
      percentChange: {
        customers: Math.round(customersChange * 100) / 100,
        orders: Math.round(ordersChange * 100) / 100,
        averageOrder: Math.round(averageOrderChange * 100) / 100,
        revenue: Math.round((Math.random() * 20 - 5) * 100) / 100 // Simulate revenue change
      }
    };

    console.log('✅ Calculated stats:', stats);

    res.json({
      message: 'Admin stats retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch admin statistics'
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
    console.log('📦 Fetching admin orders with filters:', { status });

    const filters = {};
    if (status && status !== 'all') {
      filters.status = status;
    }

    const orders = await OrderManager.getAllOrders(filters);
    
    // Transform the data to include customer names and item counts
    const transformedOrders = orders.map(order => ({
      order_id: order.order_id,
      customer_name: `${order.first_name} ${order.last_name}`,
      email: order.email,
      order_date: order.order_date,
      total_price: parseFloat(order.total_price),
      status: order.status,
      items_count: Math.floor(Math.random() * 5) + 1 // Simulate item count for demo
    }));

    res.json({
      message: 'Admin orders retrieved successfully',
      orders: transformedOrders
    });
  } catch (error) {
    console.error('❌ Error fetching admin orders:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch admin orders'
    });
  }
});

/**
 * GET /api/admin/meals/top
 * Get top performing meals
 */
router.get('/meals/top', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    console.log('🍽️ Fetching top meals with limit:', limit);

    const topMeals = await MealOrderManager.getMealPopularityStats({ limit });

    const transformedMeals = topMeals.map(meal => ({
      meal_id: meal.meal_id,
      name: meal.meal,
      category: meal.category || 'Other',
      price: parseFloat(meal.price) || 0,
      calories: meal.calories || 0,
      image_url: meal.image_url || '/images/meals/default.jpg',
      popularity_score: meal.total_quantity_ordered || 0
    }));

    res.json({
      message: 'Top meals retrieved successfully',
      meals: transformedMeals
    });
  } catch (error) {
    console.error('❌ Error fetching top meals:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch top meals'
    });
  }
});

/**
 * GET /api/admin/customers/stats
 * Get customer statistics
 */
router.get('/customers/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log('👥 Fetching customer stats...');

    const { UserStatsManager } = require('../../../database/src');
    const userStats = await UserStatsManager.getUserStats();
    const activeUserStats = await UserStatsManager.getActiveUserStats();

    const stats = {
      totalCustomers: userStats.totalUsers,
      activeCustomers: activeUserStats.activeUsers,
      newCustomersThisWeek: userStats.newUsersThisWeek
    };

    res.json({
      message: 'Customer stats retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('❌ Error fetching customer stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch customer statistics'
    });
  }
});

module.exports = router;
