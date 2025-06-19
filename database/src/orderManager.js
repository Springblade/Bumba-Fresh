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
   * @param {string} orderType - Order type ('individual' or 'subscription')
   * @param {string} deliveryAddress - Delivery address
   * @param {number} planId - Subscription plan ID (optional)
   * @returns {Promise<Object>} Operation result with order ID
   */
  static async addOrder(userId, totalPrice, status = 'pending', orderType = 'individual', deliveryAddress = null, planId = null) {
    const query = `
      INSERT INTO "order" (user_id, plan_id, total_price, status, order_type, delivery_address) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING order_id, user_id, total_price, status, order_type, order_date
    `;
    
    try {
      const result = await db.query(query, [userId, planId, totalPrice, status, orderType, deliveryAddress]);
      
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
   */
  static async getOrderById(orderId) {
    const query = `
      SELECT o.order_id, o.user_id, o.plan_id, o.total_price, o.status, 
             o.order_type, o.delivery_address, o.order_date, o.updated_at,
             a.username, a.email, a.first_name, a.last_name
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
   * Get orders by user ID
   * @param {number} userId - User ID
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} Array of orders
   */
  static async getOrdersByUserId(userId, status = null) {
    let query = `
      SELECT order_id, user_id, plan_id, total_price, status, 
             order_type, delivery_address, order_date, updated_at
      FROM "order" 
      WHERE user_id = $1
    `;
    
    const params = [userId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY order_date DESC';
    
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      return [];
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
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE order_id = $2
      RETURNING order_id, status, updated_at
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
   */
  static async getAllOrders(filters = {}) {
    let query = `
      SELECT o.order_id, o.user_id, o.plan_id, o.total_price, o.status, 
             o.order_type, o.delivery_address, o.order_date, o.updated_at,
             a.username, a.email, a.first_name, a.last_name
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

    if (filters.orderType) {
      paramCount++;
      query += ` AND o.order_type = $${paramCount}`;
      params.push(filters.orderType);
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

  /**
   * Calculate total revenue
   * @param {Object} filters - Optional date filters
   * @returns {Promise<number>} Total revenue
   */
  static async getTotalRevenue(filters = {}) {
    let query = `
      SELECT COALESCE(SUM(total_price), 0) as total_revenue
      FROM "order" 
      WHERE status = 'delivered'
    `;
    
    const params = [];
    let paramCount = 0;

    if (filters.startDate) {
      paramCount++;
      query += ` AND order_date >= $${paramCount}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      paramCount++;
      query += ` AND order_date <= $${paramCount}`;
      params.push(filters.endDate);
    }
    
    try {
      const result = await db.query(query, params);
      return parseFloat(result.rows[0].total_revenue) || 0;
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
  }

  /**
   * Get order statistics
   * @returns {Promise<Object>} Order statistics
   */
  static async getOrderStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
        COUNT(CASE WHEN status = 'preparing' THEN 1 END) as preparing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        AVG(total_price) as average_order_value
      FROM "order"
    `;
    
    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting order statistics:', error);
      return {};
    }
  }
}

module.exports = OrderManager;
