const db = require('./connect');

/**
 * User Statistics Manager
 * Handles user-related statistics and analytics for admin dashboard
 */
class UserStatsManager {
  /**
   * Get total no. user for admin dashboard
   * @returns {Promise<Object>} User statistics
   */
  static async getUserStats() {
    try {      const query = `
        SELECT 
          COUNT(*) as total_users
        FROM account
        WHERE role = 'user'
      `;
      
      const result = await db.query(query);
      const stats = result.rows[0];
      
      return {
        totalUsers: parseInt(stats.total_users) || 0,
        newUsersThisWeek: parseInt(stats.new_users_this_week) || 0
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Return fallback data if query fails
      return {
        totalUsers: 0,
        newUsersThisWeek: 0
      };
    }
  }
  /**
   * Get the no. of order
   * @returns {Promise<Object>} Total number of order
   */
  static async getTotalOrder() {
    try {
      const query = `
        SELECT COUNT(*) as total_orders
        FROM "order"
      `;
      
      const result = await db.query(query);
      const stats = result.rows[0];
      
      return {
        totalOrders: parseInt(stats.total_orders) || 0
      };
    } catch (error) {
      console.error('Error getting total orders:', error);
      return {
        totalOrders: 0
      };
    }
  }
  /**
   * Get the average value of the orders
   * @returns {Promise<Object>} Orders value statistics
   */
  static async getAvgOrderVal() {
    try {
      const query = `
        SELECT 
          AVG(total_price) as avg_order_value,
          COUNT(*) as total_orders,
          SUM(total_price) as total_revenue
        FROM "order"
        WHERE status != 'cancelled'
      `;
      
      const result = await db.query(query);
      const stats = result.rows[0];
      
      return {
        avgOrderValue: parseFloat(stats.avg_order_value) || 0,
        totalOrders: parseInt(stats.total_orders) || 0,
        totalRevenue: parseFloat(stats.total_revenue) || 0
      };
    } catch (error) {
      console.error('Error getting average order value:', error);
      return {
        avgOrderValue: 0,
        totalOrders: 0,
        totalRevenue: 0
      };
    }
  }
  /**
   * Get list of all orders
   * @returns {Promise<Array>} Array of orders
   */
  static async getOrders() {
    try {
      const query = `
        SELECT 
          o.order_id,
          o.user_id,
          a.first_name,
          a.last_name,
          a.email,
          o.total_price,
          o.status,
          o.order_date,
          COUNT(om.meal_id) as total_items
        FROM "order" o
        JOIN account a ON o.user_id = a.user_id
        LEFT JOIN order_meal om ON o.order_id = om.order_id
        GROUP BY o.order_id, o.user_id, a.first_name, a.last_name, a.email, o.total_price, o.status, o.order_date
        ORDER BY o.order_date DESC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(order => ({
        orderId: order.order_id,
        userId: order.user_id,
        customerName: `${order.first_name} ${order.last_name}`,
        customerEmail: order.email,
        totalPrice: parseFloat(order.total_price),
        status: order.status,
        orderDate: order.order_date,
        totalItems: parseInt(order.total_items)
      }));
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }
  /**
   * Get list of all customers/users
   * @returns {Promise<Array>} Array of customers
   */
  static async getCustomers() {
    try {
      const query = `
        SELECT 
          a.user_id,
          a.first_name,
          a.last_name,
          a.email,
          a.phone,
          a.created_at,
          p.plan_id IS NOT NULL as has_subscription,
          COUNT(o.order_id) as order_count,
          COALESCE(SUM(o.total_price), 0) as total_spent,
          MAX(o.order_date) as last_order_date
        FROM account a
        LEFT JOIN plan p ON a.user_id = p.user_id AND p.time_expired > CURRENT_DATE
        LEFT JOIN "order" o ON a.user_id = o.user_id
        WHERE a.role = 'user'
        GROUP BY a.user_id, a.first_name, a.last_name, a.email, a.phone, a.created_at, p.plan_id
        ORDER BY a.created_at DESC
      `;
      
      const result = await db.query(query);
      
      return result.rows.map(customer => ({
        id: customer.user_id.toString(),
        firstName: customer.first_name,
        lastName: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        subscribed: customer.has_subscription,
        ordersCount: parseInt(customer.order_count) || 0,
        totalSpent: parseFloat(customer.total_spent) || 0,
        joinedDate: new Date(customer.created_at).toLocaleDateString(),
        lastOrderDate: customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : null,
        status: 'active' // Default status
      }));
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  }
}

module.exports = UserStatsManager;
