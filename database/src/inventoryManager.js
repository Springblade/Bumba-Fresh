const db = require('./connect');

/**
 * Inventory management utility - JavaScript equivalent of Inventory_Management.java
 * Enhanced with comprehensive meal management functionality
 */
class InventoryManager {
  /**
   * Add a new meal to inventory
   * @param {string} meal - Meal name
   * @param {string} description - Meal description
   * @param {number} quantity - Available quantity
   * @param {number} price - Meal price
   * @param {string} category - Meal category
   * @param {Array} dietaryInfo - Array of dietary information
   * @param {number} prepTime - Preparation time in minutes
   * @param {number} calories - Calorie content
   * @param {string} imageUrl - Image URL
   * @returns {Promise<Object>} Operation result
   */
  static async addMealKit(meal, description = null, quantity, price, category = null, dietaryInfo = [], prepTime = null, calories = null, imageUrl = null) {
    const query = `
      INSERT INTO inventory (meal, description, quantity, price, category, dietary_info, prep_time, calories, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING meal_id, meal, description, quantity, price, category, dietary_info, prep_time, calories, image_url, created_at
    `;
    
    try {
      const result = await db.query(query, [
        meal, description, quantity, price, category, dietaryInfo, prepTime, calories, imageUrl
      ]);
      
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
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE meal_id = $2 AND is_active = true
      RETURNING meal_id, meal, quantity, updated_at
    `;
    
    try {
      const result = await db.query(query, [quantity, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Meal not found or inactive'
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
      SET price = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE meal_id = $2 AND is_active = true
      RETURNING meal_id, meal, price, updated_at
    `;
    
    try {
      const result = await db.query(query, [price, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Meal not found or inactive'
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
      SELECT meal_id, meal, description, quantity, price, category, 
             dietary_info, prep_time, calories, image_url, is_active, 
             created_at, updated_at
      FROM inventory 
      WHERE meal_id = $1
    `;
    
    try {
      const result = await db.query(query, [mealId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting meal by ID:', error);
      return null;
    }
  }

  /**
   * Get all active meals
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of meals
   */
  static async getAllMeals(filters = {}) {
    let query = `
      SELECT meal_id, meal, description, quantity, price, category, 
             dietary_info, prep_time, calories, image_url, is_active, 
             created_at, updated_at
      FROM inventory 
      WHERE is_active = true
    `;
    
    const params = [];
    let paramCount = 0;

    // Add filters
    if (filters.category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(filters.category);
    }

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

    query += ' ORDER BY meal ASC';
    
    try {
      const result = await db.query(query, params);
      return result.rows;
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
      WHERE meal_id = $1 AND is_active = true
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
      SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP 
      WHERE meal_id = $2 AND is_active = true AND quantity >= $1
      RETURNING meal_id, meal, quantity, updated_at
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
      WHERE is_active = true AND quantity <= $1
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

  /**
   * Update a meal's details
   * @param {number} mealId - Meal ID
   * @param {Object} updates - Object containing fields to update
   * @returns {Promise<Object>} Updated meal object or null
   */
  static async updateMeal(mealId, updates) {
    const {
      meal,
      description,
      quantity,
      price,
      category,
      dietaryInfo,
      prepTime,
      calories,
      imageUrl,
      isActive
    } = updates;

    const query = `
      UPDATE inventory 
      SET meal = $1, description = $2, quantity = $3, price = $4, category = $5, 
          dietary_info = $6, prep_time = $7, calories = $8, image_url = $9, is_active = $10, 
          updated_at = CURRENT_TIMESTAMP
      WHERE meal_id = $11 
      RETURNING meal_id, meal, description, quantity, price, category, dietary_info, prep_time, calories, image_url, is_active, updated_at
    `;
    
    try {
      const result = await db.query(query, [
        meal, description, quantity, price, category, dietaryInfo, 
        prepTime, calories, imageUrl, isActive, mealId
      ]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating meal:', error);
      return null;
    }
  }

  /**
   * Get all distinct meal categories
   * @returns {Promise<Array>} Array of categories with meal counts
   */
  static async getCategories() {
    const query = `
      SELECT DISTINCT category, COUNT(*) as meal_count 
      FROM inventory 
      WHERE is_active = true AND category IS NOT NULL 
      GROUP BY category 
      ORDER BY category
    `;
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  /**
   * Get all distinct dietary options
   * @returns {Promise<Array>} Array of dietary options with meal counts
   */
  static async getDietaryOptions() {
    const query = `
      SELECT DISTINCT UNNEST(dietary_info) as dietary_option, COUNT(*) as meal_count
      FROM inventory 
      WHERE is_active = true AND dietary_info IS NOT NULL 
      GROUP BY dietary_option 
      ORDER BY dietary_option
    `;
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting dietary options:', error);
      return [];
    }
  }
}

module.exports = InventoryManager;
