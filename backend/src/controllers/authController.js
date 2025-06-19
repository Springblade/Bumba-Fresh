const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { validationResult } = require('express-validator');

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
    }

    const { username, password, email, firstName, lastName, phone, address } = req.body;

    // Check if username already exists (equivalent to unique() method in Java)
    const existingUser = await query(
      'SELECT user_id FROM account WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'Username or email is already taken'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user (equivalent to insert() method in Java)
    const result = await query(
      `INSERT INTO account (username, password, email, first_name, last_name, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING user_id, username, email, first_name, last_name, created_at`,
      [username, hashedPassword, email, firstName, lastName, phone, address]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.user_id, 
        username: newUser.username,
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        createdAt: newUser.created_at
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
    }

    const { username, password } = req.body;

    // Find user (equivalent to check() method in Java but with password hashing)
    const result = await query(
      `SELECT user_id, username, password, email, first_name, last_name, phone, address 
       FROM account WHERE username = $1 OR email = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        username: user.username,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        address: user.address
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

    // Get fresh user data
    const result = await query(
      `SELECT user_id, username, email, first_name, last_name, phone, address, created_at 
       FROM account WHERE user_id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        address: user.address,
        createdAt: user.created_at
      }
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
