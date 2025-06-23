require('dotenv').config();
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { AccountCreator, LoginManager } = require('../../../database/src');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Register a new user account
 * Equivalent to Create.java createAccount method
 */
const register = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }    const { password, email, firstName, lastName, phone, address } = req.body;

    // Create account using the database layer
    const result = await AccountCreator.createAccount(
      password, 
      email, 
      firstName, 
      lastName, 
      phone, 
      address
    );

    if (!result.success) {
      return res.status(409).json({
        error: result.error || 'Account creation failed',
        message: result.message || 'Failed to create account'
      });
    }    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.user.user_id, 
        email: result.user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.user.user_id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        phone: result.user.phone,
        address: result.user.address
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to register user'
    });
  }
};

/**
 * Login user
 * Equivalent to LogIn.java loginAccount method
 */
const login = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }    const { email, password } = req.body;

    // Use LoginManager to authenticate user
    const result = await LoginManager.loginAccount(email, password);

    if (!result.success) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: result.message
      });
    }    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.user.user_id, 
        email: result.user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: result.user.user_id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        phone: result.user.phone,
        address: result.user.address
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to authenticate user'
    });
  }
};

/**
 * Verify JWT token and get user info
 */
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Use LoginManager to get user by ID
    const result = await LoginManager.getUserById(decoded.userId);

    if (!result.success) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }

    res.json({
      user: result.user
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Token expired'
      });
    }

    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify token'
    });
  }
};

/**
 * Logout user (invalidate token on client side)
 */
const logout = (req, res) => {
  res.json({
    message: 'Logout successful',
    note: 'Please remove the token from client storage'
  });
};

module.exports = {
  register,
  login,
  verifyToken,
  logout
};
