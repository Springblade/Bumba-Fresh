/**
 * Database Utilities - JavaScript equivalents of Java database classes
 * 
 * This module provides a complete JavaScript implementation of the database
 * operations originally written in Java. All classes have been enhanced with:
 * - Proper error handling
 * - Parameterized queries to prevent SQL injection
 * - Password hashing for security
 * - Transaction support
 * - Comprehensive validation
 * - Modern JavaScript async/await patterns
 */

const DatabaseConnection = require('../js/connect');
const AccountCreator = require('./accountCreator');
const LoginManager = require('../js/loginManager');
const InventoryManager = require('../js/inventoryManager');
const OrderManager = require('../js/orderManager');
const MealOrderManager = require('../js/mealOrderManager');
const PlanManager = require('../js/planManager');

module.exports = {
  // Database connection
  db: DatabaseConnection,
  
  // User management
  AccountCreator,
  LoginManager,
  
  // Inventory management
  InventoryManager,
  
  // Order management
  OrderManager,
  MealOrderManager,
  
  // Subscription management
  PlanManager
};

/**
 * Usage Examples:
 * 
 * // Create a new user account
 * const { AccountCreator } = require('./database/js');
 * const result = await AccountCreator.createAccount('username', 'password', 'email@example.com');
 * 
 * // Login user
 * const { LoginManager } = require('./database/js');
 * const loginResult = await LoginManager.loginAccount('username', 'password');
 * 
 * // Add meal to inventory
 * const { InventoryManager } = require('./database/js');
 * const mealResult = await InventoryManager.addMealKit('Grilled Chicken', 'Delicious meal', 10, 15.99);
 * 
 * // Create order
 * const { OrderManager } = require('./database/js');
 * const orderResult = await OrderManager.addOrder(userId, 45.99, 'pending');
 * 
 * // Add meals to order
 * const { MealOrderManager } = require('./database/js');
 * const orderMealResult = await MealOrderManager.addMealToOrder(orderId, mealId, 2, 15.99);
 * 
 * // Create subscription plan
 * const { PlanManager } = require('./database/js');
 * const planResult = await PlanManager.addPlan('premium', 4, 15.99, 'weekly', startDate, endDate, userId);
 */
