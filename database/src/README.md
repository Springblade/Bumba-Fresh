# Database Utilities - JavaScript Implementation

This directory contains JavaScript equivalents of the original Java database classes, converted and enhanced for the Node.js backend.

## Overview

The Java database code has been completely converted to modern JavaScript with the following improvements:

###  **Security Enhancements**
- **Password Hashing**: Uses bcryptjs with salt rounds for secure password storage
- **SQL Injection Prevention**: All queries use parameterized statements
- **Input Validation**: Comprehensive validation for all inputs

###  **Modern JavaScript Features**
- **Async/Await**: Modern asynchronous programming patterns
- **Error Handling**: Comprehensive try-catch blocks with meaningful error messages
- **Promise-based**: All methods return promises for better integration

###  **Enhanced Functionality**
- **Connection Pooling**: Uses PostgreSQL connection pools for better performance
- **Transaction Support**: Built-in transaction handling for complex operations
- **Logging**: Detailed logging for debugging and monitoring
- **Statistics**: Additional methods for analytics and reporting

## File Structure

```
database/js/
├── index.js                 # Main export file
├── connect.js              # Database connection (Connect.java)
├── accountCreator.js       # User registration (Create.java)
├── loginManager.js         # User authentication (LogIn.java)
├── inventoryManager.js     # Meal inventory (Inventory_Management.java)
├── orderManager.js         # Order management (Order.java)
├── mealOrderManager.js     # Order-meal relationships (Meal_Order.java)
└── planManager.js          # Subscription plans (Plan.java)
```

## Class Mappings

| Java Class | JavaScript Class | Enhanced Features |
|------------|------------------|-------------------|
| `Connect.java` | `DatabaseConnection` | Connection pooling, error handling |
| `Create.java` | `AccountCreator` | Password hashing, email validation |
| `LogIn.java` | `LoginManager` | Secure authentication, session management |
| `Inventory_Management.java` | `InventoryManager` | Advanced filtering, statistics |
| `Order.java` | `OrderManager` | Order tracking, revenue analytics |
| `Meal_Order.java` | `MealOrderManager` | Meal popularity stats, bulk operations |
| `Plan.java` | `PlanManager` | Subscription analytics, expiration handling |

## Usage Examples

### 1. Database Connection
```javascript
const { db } = require('./database/js');

// Execute a query
const result = await db.query('SELECT * FROM account WHERE username = $1', ['john_doe']);

// Execute a transaction
const results = await db.transaction([
  { text: 'INSERT INTO account (username, password) VALUES ($1, $2)', params: ['user1', 'hash1'] },
  { text: 'INSERT INTO account (username, password) VALUES ($1, $2)', params: ['user2', 'hash2'] }
]);
```

### 2. User Management
```javascript
const { AccountCreator, LoginManager } = require('./database/js');

// Create new account
const createResult = await AccountCreator.createAccount(
  'john_doe', 
  'password123', 
  'john@example.com',
  'John',
  'Doe',
  '555-0123',
  '123 Main St'
);

// Login user
const loginResult = await LoginManager.loginAccount('john_doe', 'password123');

if (loginResult.success) {
  console.log('User logged in:', loginResult.user);
}
```

### 3. Inventory Management
```javascript
const { InventoryManager } = require('./database/js');

// Add new meal
const mealResult = await InventoryManager.addMealKit(
  'Grilled Chicken Bowl',
  'Healthy grilled chicken with quinoa and vegetables',
  50,           // quantity
  15.99,        // price
  'healthy',    // category
  ['high-protein', 'gluten-free'], // dietary info
  25,           // prep time
  450           // calories
);

// Get all meals with filters
const meals = await InventoryManager.getAllMeals({
  category: 'healthy',
  maxPrice: 20.00
});

// Check availability
const isAvailable = await InventoryManager.isMealAvailable(mealId, 3);
```

### 4. Order Management
```javascript
const { OrderManager, MealOrderManager } = require('./database/js');

// Create order
const orderResult = await OrderManager.addOrder(
  userId,           // user ID
  45.99,           // total price
  'pending',       // status
  'individual',    // order type
  '123 Main St'    // delivery address
);

// Add meals to order
const meals = [
  { mealId: 1, quantity: 2, unitPrice: 15.99 },
  { mealId: 2, quantity: 1, unitPrice: 13.99 }
];

await MealOrderManager.addMealsToOrder(orderResult.order.order_id, meals);

// Get order with meals
const orderMeals = await MealOrderManager.getMealsByOrderId(orderResult.order.order_id);
```

### 5. Subscription Management
```javascript
const { PlanManager } = require('./database/js');

// Create subscription plan
const startDate = new Date();
const endDate = new Date();
endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

const planResult = await PlanManager.addPlan(
  'premium',       // plan type
  4,              // meals per week
  15.99,          // price per meal
  'weekly',       // billing cycle
  startDate,
  endDate,
  userId
);

// Get user's active plans
const userPlans = await PlanManager.getUserPlans(userId);

// Get subscription statistics
const stats = await PlanManager.getSubscriptionStatistics();
```

## Environment Variables

The database utilities use the following environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bumba_fresh
DB_USER=postgres
DB_PASSWORD=your_password
```

## Installation

```bash
# Navigate to database directory
cd database

# Install dependencies
npm install
```

## Integration with Backend

These utilities are designed to work seamlessly with the Express.js backend:

```javascript
// In your controller files
const { AccountCreator, LoginManager } = require('../../../database/js');

// Use in route handlers
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  const result = await AccountCreator.createAccount(username, password, email);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json({ error: result.error });
  }
});
```

## Key Improvements Over Java Version

###  **Security**
- Proper password hashing with bcryptjs
- SQL injection prevention with parameterized queries
- Input sanitization and validation

###  **Performance**
- Connection pooling for database connections
- Async/await for non-blocking operations
- Transaction support for data consistency

###  **Maintainability**
- Modern JavaScript ES6+ features
- Comprehensive error handling
- Detailed logging and debugging

###  **Analytics**
- Order statistics and revenue tracking
- Meal popularity analytics
- Subscription metrics and reporting
- Low stock alerts and inventory management

###  **Testing Ready**
- Modular design for easy unit testing
- Mock-friendly architecture
- Comprehensive return objects with success/error states

## Migration Notes

The JavaScript implementation maintains the same core functionality as the Java version while adding significant enhancements:

1. **Password Security**: Unlike the Java version which stored plain text passwords, the JavaScript version uses proper password hashing
2. **Error Handling**: Much more robust error handling and user feedback
3. **Database Design**: Updated to match the new PostgreSQL schema
4. **Modern Patterns**: Uses modern JavaScript patterns and best practices
5. **Additional Features**: Many new methods for analytics, filtering, and management

This conversion provides a solid foundation for the Node.js backend while maintaining compatibility with the existing database design.
