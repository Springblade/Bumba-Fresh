const db = require('./connect');

/**
 * Inventory management utility - JavaScript equivalent of Inventory_Management.java
 * Enhanced with comprehensive meal management functionality
 */
class InventoryManager {  /**
   * Add a new meal to inventory
   * @param {string} meal - Meal name
   * @param {number} quantity - Available quantity
   * @param {number} price - Meal price
   * @returns {Promise<Object>} Operation result
   */
  static async addMealKit(meal, quantity, price) {
    const query = `
      INSERT INTO inventory (meal, quantity, price) 
      VALUES ($1, $2, $3) 
      RETURNING meal_id, meal, quantity, price
    `;
    
    try {
      const result = await db.query(query, [meal, quantity, price]);
      
      return {
        success: true,
        meal: result.rows[0],
        message: 'Meal added successfully'
      };
    } catch (error) {
      console.error('Error adding meal:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  /**
   * Update meal quantity in inventory
   * @param {number} mealId - Meal ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Operation result
   */
  static async updateMealQuantity(mealId, quantity) {
    const query = `
      UPDATE inventory 
      SET quantity = $1 
      WHERE meal_id = $2
      RETURNING meal_id, meal, quantity
    `;
    
    try {
      const result = await db.query(query, [quantity, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Meal not found'
        };
      }
      
      return {
        success: true,
        meal: result.rows[0],
        message: 'Quantity updated successfully'
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
   * Update meal price
   * @param {number} mealId - Meal ID
   * @param {number} price - New price
   * @returns {Promise<Object>} Operation result
   */
  static async updateMealPrice(mealId, price) {
    const query = `
      UPDATE inventory 
      SET price = $1 
      WHERE meal_id = $2
      RETURNING meal_id, meal, price
    `;
    
    try {
      const result = await db.query(query, [price, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Meal not found'
        };
      }
      
      return {
        success: true,
        meal: result.rows[0],
        message: 'Price updated successfully'
      };
    } catch (error) {
      console.error('Error updating meal price:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  /**
   * Get meal by ID
   * @param {number} mealId - Meal ID
   * @returns {Promise<Object|null>} Meal object or null
   */
  static async getMealById(mealId) {
    const query = `
      SELECT meal_id, meal, quantity, price
      FROM inventory 
      WHERE meal_id = $1
    `;
      try {
      const result = await db.query(query, [mealId]);
      if (result.rows.length > 0) {
        const meal = result.rows[0];
        return {
          ...meal,
          price: parseFloat(meal.price) // Ensure price is a number
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting meal by ID:', error);
      return null;
    }
  }  /**
   * Get all meals
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of meals
   */
  static async getAllMeals(filters = {}) {
    let query = `
      SELECT 
        meal_id as id,
        meal as name,
        description,
        quantity,
        price,
        category,
        dietary_options,
        image_url,
        'Healthy, Fresh' as tags,
        '20 min' as prep_time,
        CASE 
          WHEN category = 'protein' THEN 450
          WHEN category = 'vegetarian' THEN 350
          ELSE 400 
        END as calories
      FROM inventory 
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    // Add price filters
    if (filters.maxPrice) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(filters.maxPrice);
    }

    if (filters.minPrice) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(filters.minPrice);
    }

    // Add category filter
    if (filters.category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(filters.category);
    }

    query += ' ORDER BY meal ASC';
    
    try {
      const result = await db.query(query, params);
        // Transform the results to include proper tags array and other frontend expectations
      const transformedResults = result.rows.map(row => ({
        ...row,
        price: parseFloat(row.price), // Ensure price is a number
        tags: row.dietary_options ? row.dietary_options.split(',').map(tag => tag.trim()) : ['Fresh', 'Healthy']
      }));
      
      return transformedResults;
    } catch (error) {
      console.error('Error getting all meals:', error);
      return [];
    }
  }
  /**
   * Check if meal is available in sufficient quantity
   * @param {number} mealId - Meal ID
   * @param {number} requiredQuantity - Required quantity
   * @returns {Promise<boolean>} True if available
   */
  static async isMealAvailable(mealId, requiredQuantity) {
    const query = `
      SELECT quantity 
      FROM inventory 
      WHERE meal_id = $1
    `;
    
    try {
      const result = await db.query(query, [mealId]);
      
      if (result.rows.length === 0) {
        return false;
      }
      
      return result.rows[0].quantity >= requiredQuantity;
    } catch (error) {
      console.error('Error checking meal availability:', error);
      return false;
    }
  }
  /**
   * Decrease meal quantity (for orders)
   * @param {number} mealId - Meal ID
   * @param {number} quantity - Quantity to decrease
   * @returns {Promise<Object>} Operation result
   */
  static async decreaseMealQuantity(mealId, quantity) {
    const query = `
      UPDATE inventory 
      SET quantity = quantity - $1 
      WHERE meal_id = $2 AND quantity >= $1
      RETURNING meal_id, meal, quantity
    `;
    
    try {
      const result = await db.query(query, [quantity, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Insufficient quantity or meal not found'
        };
      }
      
      return {
        success: true,
        meal: result.rows[0],
        message: 'Quantity decreased successfully'
      };
    } catch (error) {
      console.error('Error decreasing meal quantity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  /**
   * Get low stock meals (quantity below threshold)
   * @param {number} threshold - Quantity threshold (default: 10)
   * @returns {Promise<Array>} Array of low stock meals
   */
  static async getLowStockMeals(threshold = 10) {
    const query = `
      SELECT meal_id, meal, quantity, price 
      FROM inventory 
      WHERE quantity <= $1
      ORDER BY quantity ASC
    `;
    
    try {
      const result = await db.query(query, [threshold]);
      return result.rows;
    } catch (error) {
      console.error('Error getting low stock meals:', error);
      return [];
    }
  }
}

module.exports = InventoryManager;
