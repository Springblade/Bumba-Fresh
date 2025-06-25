const db = require('./connect');

/**
 * Order management utility - JavaScript equivalent of Order.java
 * Enhanced with comprehensive order management functionality
 */
class OrderManager {
  /**
   * Create a new order
   * @param {number} userId - User ID
   * @param {number} totalPrice - Total order price
   * @param {string} status - Order status (default: 'pending')
   * @returns {Promise<Object>} Operation result with order ID
   */
  static async addOrder(userId, totalPrice, status = 'pending') {
    const query = `
      INSERT INTO "order" (user_id, total_price, status) 
      VALUES ($1, $2, $3) 
      RETURNING order_id, user_id, total_price, status, order_date
    `;
    
    try {
      const result = await db.query(query, [userId, totalPrice, status]);
      
      return {
        success: true,
        order: result.rows[0],
        message: 'Order created successfully'
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  /**
   * Get order by ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Object|null>} Order object or null
   */  static async getOrderById(orderId) {
    const query = `
      SELECT o.order_id, o.user_id, o.total_price, o.status, o.order_date,
             a.email, a.first_name, a.last_name
      FROM "order" o
      JOIN account a ON o.user_id = a.user_id
      WHERE o.order_id = $1
    `;
    
    try {
      const result = await db.query(query, [orderId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return null;
    }
  }
  /**
   * Get order by ID and user ID (for security - users can only see their own orders)
   * @param {number} orderId - Order ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Operation result with order data
   */
  static async getOrderByIdAndUserId(orderId, userId) {
    const query = `
      SELECT o.order_id, o.user_id, o.total_price, o.status, o.order_date,
             a.email, a.first_name, a.last_name
      FROM "order" o
      JOIN account a ON o.user_id = a.user_id
      WHERE o.order_id = $1 AND o.user_id = $2
    `;
    
    try {
      const result = await db.query(query, [orderId, userId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Order not found'
        };
      }
      
      return {
        success: true,
        order: result.rows[0],
        message: 'Order retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting order by ID and user ID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }  /**
   * Get orders by user ID
   * @param {number} userId - User ID
   * @param {string} status - Optional status filter
   * @returns {Promise<Object>} Operation result with orders array
   */    static async getOrdersByUserId(userId, status = null) {
    let query = `
      SELECT o.order_id, o.user_id, o.total_price, o.status, o.order_date,
             COALESCE(SUM(om.quantity), 0) as items_count
      FROM "order" o
      LEFT JOIN order_meal om ON o.order_id = om.order_id
      WHERE o.user_id = $1
    `;
    
    const params = [userId];
    
    if (status) {
      query += ' AND o.status = $2';
      params.push(status);
    }
    
    query += ' GROUP BY o.order_id, o.user_id, o.total_price, o.status, o.order_date ORDER BY o.order_date DESC';
    
    try {
      const result = await db.query(query, params);
      return {
        success: true,
        orders: result.rows,
        message: 'Orders retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      return {
        success: false,
        error: error.message,
        orders: []
      };
    }
  }
  /**
   * Update order status
   * @param {number} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Operation result
   */
  static async updateOrderStatus(orderId, status) {
    const query = `
      UPDATE "order" 
      SET status = $1 
      WHERE order_id = $2
      RETURNING order_id, status
    `;
    
    try {
      const result = await db.query(query, [status, orderId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Order not found'
        };
      }
      
      return {
        success: true,
        order: result.rows[0],
        message: 'Order status updated successfully'
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get latest order ID for a user
   * @param {number} userId - User ID
   * @returns {Promise<number|null>} Latest order ID or null
   */
  static async getLatestOrderId(userId) {
    const query = `
      SELECT order_id 
      FROM "order" 
      WHERE user_id = $1 
      ORDER BY order_date DESC 
      LIMIT 1
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows.length > 0 ? result.rows[0].order_id : null;
    } catch (error) {
      console.error('Error getting latest order ID:', error);
      return null;
    }
  }

  /**
   * Get all orders with optional filtering
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of orders
   */  static async getAllOrders(filters = {}) {
    let query = `
      SELECT o.order_id, o.user_id, o.total_price, o.status, o.order_date,
             a.email, a.first_name, a.last_name
      FROM "order" o
      JOIN account a ON o.user_id = a.user_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (filters.status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters.startDate) {
      paramCount++;
      query += ` AND o.order_date >= $${paramCount}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      paramCount++;
      query += ` AND o.order_date <= $${paramCount}`;
      params.push(filters.endDate);
    }

    query += ' ORDER BY o.order_date DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting all orders:', error);
      return [];
    }
  }
}

module.exports = OrderManager;
