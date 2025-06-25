// Minimal backend startup test
try {
    console.log(' Testing backend startup...');
    
    // Test if dotenv loads
    require('dotenv').config();
    console.log(' dotenv loaded');
    
    // Test if express loads
    const express = require('express');
    console.log(' express loaded');
    
    // Test if database utilities load
    const { AccountCreator, LoginManager } = require('../../database/src');
    console.log(' database utilities loaded');
    
    // Test if all routes load
    const authRoutes = require('./routes/auth.js');
    console.log(' auth routes loaded');
    
    const mealsRoutes = require('./routes/meals');
    console.log(' meals routes loaded');
    
    const ordersRoutes = require('./routes/orders');
    console.log(' orders routes loaded');
    
    const plansRoutes = require('./routes/plans');
    console.log(' plans routes loaded');
    
    const usersRoutes = require('./routes/users');
    console.log(' users routes loaded');
    
    // Test if middleware loads
    const errorHandler = require('./middleware/errorHandler');
    console.log(' error handler loaded');
    
    const logger = require('./middleware/logger');
    console.log(' logger loaded');
    
    console.log('\n All modules loaded successfully!');
    console.log(' Starting server...');
    
    // Now start the actual server
    require('./index.js');
    
} catch (error) {
    console.error(' Startup failed:', error.message);
    console.error(' Stack trace:', error.stack);
    process.exit(1);
}
