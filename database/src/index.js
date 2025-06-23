// Database module exports
const db = require('./connect');
const AccountCreator = require('./accountCreator');
const InventoryManager = require('./inventoryManager');
const LoginManager = require('./loginManager');
const MealOrderManager = require('./mealOrderManager');
const OrderManager = require('./orderManager');
const PlanManager = require('./planManager');
const FavoriteManager = require('./favoriteManager');

module.exports = {
  db,
  AccountCreator,
  InventoryManager, 
  LoginManager,
  MealOrderManager,
  OrderManager,
  PlanManager,
  FavoriteManager
};
