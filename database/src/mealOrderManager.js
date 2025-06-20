const db = require('./connect');

/**
 * Meal-Order relationship manager - JavaScript equivalent of Meal_Order.java
 * Manages the many-to-many relationship between orders and meals
 */
class MealOrderManager {
  /**
   * Add meals to an order
   * @param {number} orderId - Order ID
   * @param {number} mealId - Meal ID
   * @param {number} quantity - Quantity of meals
   * @param {number} unitPrice - Price per meal unit
   * @returns {Promise<Object>} Operation result
   */
  static async addMealToOrder(orderId, mealId, quantity, unitPrice) {
    const query = `
      INSERT INTO order_meal (order_id, meal_id, quantity, unit_price) 
      VALUES ($1, $2, $3, $4) 
      RETURNING order_id, meal_id, quantity, unit_price
    `;
    
    try {
      const result = await db.query(query, [orderId, mealId, quantity, unitPrice]);
      
      return {
        success: true,
        orderMeal: result.rows[0],
        message: 'Meal added to order successfully'
      };
    } catch (error) {
      console.error('Error adding meal to order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add multiple meals to an order in a transaction
   * @param {number} orderId - Order ID
   * @param {Array} meals - Array of {mealId, quantity, unitPrice} objects
   * @returns {Promise<Object>} Operation result
   */
  static async addMealsToOrder(orderId, meals) {
    const queries = meals.map(meal => ({
      text: 'INSERT INTO order_meal (order_id, meal_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
      params: [orderId, meal.mealId, meal.quantity, meal.unitPrice]
    }));

    try {
      await db.transaction(queries);
      
      return {
        success: true,
        message: `${meals.length} meals added to order successfully`
      };
    } catch (error) {
      console.error('Error adding meals to order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all meals for a specific order
   * @param {number} orderId - Order ID
   * @returns {Promise<Array>} Array of order meals with meal details
   */  static async getMealsByOrderId(orderId) {
    const query = `
      SELECT om.order_id, om.meal_id, om.quantity, om.unit_price,
             i.meal, i.quantity as available_quantity, i.price
      FROM order_meal om
      JOIN inventory i ON om.meal_id = i.meal_id
      WHERE om.order_id = $1
      ORDER BY i.meal
    `;
    
    try {
      const result = await db.query(query, [orderId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting meals by order ID:', error);
      return [];
    }
  }

  /**
   * Get order history for a specific meal
   * @param {number} mealId - Meal ID
   * @param {number} limit - Optional limit (default: 50)
   * @returns {Promise<Array>} Array of orders containing this meal
   */  static async getOrdersByMealId(mealId, limit = 50) {
    const query = `
      SELECT om.order_id, om.quantity, om.unit_price,
             o.user_id, o.total_price, o.status, o.order_date,
             a.email, a.first_name, a.last_name
      FROM order_meal om
      JOIN "order" o ON om.order_id = o.order_id
      JOIN account a ON o.user_id = a.user_id
      WHERE om.meal_id = $1
      ORDER BY o.order_date DESC
      LIMIT $2
    `;
    
    try {
      const result = await db.query(query, [mealId, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting orders by meal ID:', error);
      return [];
    }
  }

  /**
   * Update meal quantity in an order
   * @param {number} orderId - Order ID
   * @param {number} mealId - Meal ID
   * @param {number} newQuantity - New quantity
   * @returns {Promise<Object>} Operation result
   */
  static async updateMealQuantity(orderId, mealId, newQuantity) {
    const query = `
      UPDATE order_meal 
      SET quantity = $1
      WHERE order_id = $2 AND meal_id = $3
      RETURNING order_id, meal_id, quantity, unit_price
    `;
    
    try {
      const result = await db.query(query, [newQuantity, orderId, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Order meal not found'
        };
      }
      
      return {
        success: true,
        orderMeal: result.rows[0],
        message: 'Meal quantity updated successfully'
      };
    } catch (error) {
      console.error('Error updating meal quantity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove a meal from an order
   * @param {number} orderId - Order ID
   * @param {number} mealId - Meal ID
   * @returns {Promise<Object>} Operation result
   */
  static async removeMealFromOrder(orderId, mealId) {
    const query = `
      DELETE FROM order_meal 
      WHERE order_id = $1 AND meal_id = $2
      RETURNING order_id, meal_id
    `;
    
    try {
      const result = await db.query(query, [orderId, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Order meal not found'
        };
      }
      
      return {
        success: true,
        message: 'Meal removed from order successfully'
      };
    } catch (error) {
      console.error('Error removing meal from order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get order total from meal items
   * @param {number} orderId - Order ID
   * @returns {Promise<number>} Total order value from meals
   */
  static async getOrderMealTotal(orderId) {
    const query = `
      SELECT COALESCE(SUM(quantity * unit_price), 0) as total
      FROM order_meal 
      WHERE order_id = $1
    `;
    
    try {
      const result = await db.query(query, [orderId]);
      return parseFloat(result.rows[0].total) || 0;
    } catch (error) {
      console.error('Error calculating order meal total:', error);
      return 0;
    }
  }

  /**
   * Get meal popularity statistics
   * @param {Object} filters - Optional date filters
   * @returns {Promise<Array>} Array of meals with order statistics
   */  static async getMealPopularityStats(filters = {}) {
    let query = `
      SELECT om.meal_id, i.meal,
             COUNT(om.order_id) as times_ordered,
             SUM(om.quantity) as total_quantity_ordered,
             AVG(om.unit_price) as average_price,
             SUM(om.quantity * om.unit_price) as total_revenue
      FROM order_meal om
      JOIN inventory i ON om.meal_id = i.meal_id
      JOIN "order" o ON om.order_id = o.order_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

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

    if (filters.status) {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      params.push(filters.status);
    }

    query += `
      GROUP BY om.meal_id, i.meal
      ORDER BY total_quantity_ordered DESC
    `;

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting meal popularity stats:', error);
      return [];
    }
  }

  /**
   * Check if order contains specific meal
   * @param {number} orderId - Order ID
   * @param {number} mealId - Meal ID
   * @returns {Promise<boolean>} True if order contains the meal
   */
  static async orderContainsMeal(orderId, mealId) {
    const query = `
      SELECT 1 FROM order_meal 
      WHERE order_id = $1 AND meal_id = $2
    `;
    
    try {
      const result = await db.query(query, [orderId, mealId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking if order contains meal:', error);
      return false;
    }
  }
}

module.exports = MealOrderManager;
