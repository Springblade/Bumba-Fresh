require('dotenv').config();
const jwt = require('jsonwebtoken');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key';

/**
 * Authentication middleware to verify JWT tokens
 * This middleware extracts the token from the Authorization header,
 * verifies it, and adds the user information to the request object.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization required',
        message: 'No authorization header provided'
      });
    }

    // Check if it's a Bearer token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: 'Authorization required',
        message: 'No token provided'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists in database and get role
    const { query } = require('../config/database');
    const result = await query(
      'SELECT user_id, email, first_name, last_name, role FROM account WHERE user_id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found'
      });
    }

    // Add user information to request object
    req.user = {
      id: decoded.userId,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      role: result.rows[0].role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'The provided token has expired'
      });
    }

    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Failed to authenticate token'
    });
  }
};

module.exports = authMiddleware;
