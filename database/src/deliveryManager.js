const db = require('./connect');

/**
 * Delivery management utility
 * Manages delivery information for orders
 */
class DeliveryManager {
  /**
   * Create delivery record for an order
   * @param {number} orderId - Order ID
   * @param {Object} deliveryInfo - Delivery information
   * @param {string} deliveryInfo.delivery_address - Full delivery address
   * @param {string} deliveryInfo.s_firstname - Shipping first name
   * @param {string} deliveryInfo.s_lastname - Shipping last name
   * @param {string} deliveryInfo.s_phone - Shipping phone
   * @param {string} deliveryInfo.city - City
   * @param {string} deliveryInfo.delivery_status - Delivery status (default: 'pending')
   * @param {Date} deliveryInfo.estimated_time - Estimated delivery time (optional)
   * @returns {Promise<Object>} Operation result
   */
  static async createDeliveryRecord(orderId, deliveryInfo) {
    const {
      delivery_address,
      s_firstname,
      s_lastname,
      s_phone,
      city,
      delivery_status = 'pending',
      estimated_time = null
    } = deliveryInfo;

    const query = `
      INSERT INTO delivery (
        order_id, 
        delivery_status, 
        estimated_time, 
        delivery_address, 
        s_firstname, 
        s_lastname, 
        s_phone, 
        city
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;

    try {
      const result = await db.query(query, [
        orderId,
        delivery_status,
        estimated_time,
        delivery_address,
        s_firstname,
        s_lastname,
        s_phone,
        city
      ]);

      return {
        success: true,
        delivery: result.rows[0],
        message: 'Delivery record created successfully'
      };
    } catch (error) {
      console.error('Error creating delivery record:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get delivery information by order ID
   * @param {number} orderId - Order ID
   * @returns {Promise<Object>} Operation result with delivery data
   */
  static async getDeliveryByOrderId(orderId) {
    const query = `
      SELECT 
        delivery_id,
        order_id,
        delivery_status,
        estimated_time,
        delivery_address,
        s_firstname,
        s_lastname,
        s_phone,
        city
      FROM delivery 
      WHERE order_id = $1
    `;

    try {
      const result = await db.query(query, [orderId]);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Delivery record not found for this order'
        };
      }

      return {
        success: true,
        delivery: result.rows[0],
        message: 'Delivery information retrieved successfully'
      };
    } catch (error) {
      console.error('Error getting delivery by order ID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update delivery status
   * @param {number} orderId - Order ID
   * @param {string} status - New delivery status
   * @param {Date} estimatedTime - Optional estimated delivery time
   * @returns {Promise<Object>} Operation result
   */
  static async updateDeliveryStatus(orderId, status, estimatedTime = null) {
    let query = `
      UPDATE delivery 
      SET delivery_status = $1
    `;
    const params = [status, orderId];

    if (estimatedTime) {
      query += `, estimated_time = $2 WHERE order_id = $3`;
      params.splice(1, 0, estimatedTime);
    } else {
      query += ` WHERE order_id = $2`;
    }

    query += ` RETURNING *`;

    try {
      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Delivery record not found'
        };
      }

      return {
        success: true,
        delivery: result.rows[0],
        message: 'Delivery status updated successfully'
      };
    } catch (error) {
      console.error('Error updating delivery status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all deliveries with optional status filter
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} Array of delivery records
   */
  static async getAllDeliveries(status = null) {
    let query = `
      SELECT d.*, o.user_id, o.total_price, o.order_date, 
             a.email, a.first_name, a.last_name
      FROM delivery d
      JOIN "order" o ON d.order_id = o.order_id
      JOIN account a ON o.user_id = a.user_id
    `;

    const params = [];

    if (status) {
      query += ' WHERE d.delivery_status = $1';
      params.push(status);
    }

    query += ' ORDER BY o.order_date DESC';

    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting all deliveries:', error);
      return [];
    }
  }

  /**
   * Get delivery statistics
   * @returns {Promise<Object>} Delivery statistics
   */
  static async getDeliveryStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_deliveries,
        COUNT(CASE WHEN delivery_status = 'pending' THEN 1 END) as pending_deliveries,
        COUNT(CASE WHEN delivery_status = 'in_transit' THEN 1 END) as in_transit_deliveries,
        COUNT(CASE WHEN delivery_status = 'delivered' THEN 1 END) as delivered_deliveries,
        COUNT(CASE WHEN delivery_status = 'failed' THEN 1 END) as failed_deliveries
      FROM delivery
    `;

    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting delivery statistics:', error);
      return {};
    }
  }
}

module.exports = DeliveryManager;
