const db = require('./connect');

/**
 * Favorite management utility - handles user favorite meals functionality
 * Allows users to add, remove, and manage their favorite meals
 */
class FavoriteManager {
  /**
   * Add a meal to user's favorites
   * @param {number} userId - User ID
   * @param {number} mealId - Meal ID to add to favorites
   * @returns {Promise<Object>} Operation result
   */
  static async addFavorite(userId, mealId) {
    // First check if meal exists
    const mealCheck = `SELECT meal_id FROM inventory WHERE meal_id = $1`;
    
    try {
      const mealResult = await db.query(mealCheck, [mealId]);
      if (mealResult.rows.length === 0) {
        return {
          success: false,
          error: 'MEAL_NOT_FOUND',
          message: 'Meal does not exist'
        };
      }

      const query = `
        INSERT INTO favorite (user_id, meal_id) 
        VALUES ($1, $2) 
        RETURNING favorite_id, user_id, meal_id, created_at
      `;
      
      const result = await db.query(query, [userId, mealId]);
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Meal added to favorites successfully'
      };
    } catch (error) {
      console.error('Error adding favorite:', error);
      
      // Handle duplicate constraint violation
      if (error.code === '23505') {
        return {
          success: false,
          error: 'ALREADY_FAVORITED',
          message: 'Meal is already in your favorites'
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove a meal from user's favorites
   * @param {number} userId - User ID
   * @param {number} mealId - Meal ID to remove from favorites
   * @returns {Promise<Object>} Operation result
   */
  static async removeFavorite(userId, mealId) {
    const query = `
      DELETE FROM favorite 
      WHERE user_id = $1 AND meal_id = $2
      RETURNING favorite_id, user_id, meal_id
    `;
    
    try {
      const result = await db.query(query, [userId, mealId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'FAVORITE_NOT_FOUND',
          message: 'Favorite not found'
        };
      }
      
      return {
        success: true,
        data: result.rows[0],
        message: 'Meal removed from favorites successfully'
      };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all favorites for a user with meal details
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of user's favorite meals
   */
  static async getUserFavorites(userId, options = {}) {
    const { search, category, sort = 'created_at', order = 'desc', limit, offset } = options;
    
    let query = `
      SELECT 
        f.favorite_id,
        f.meal_id,
        f.user_id,
        f.created_at as favorited_at,
        i.meal as meal_name,
        i.description,
        i.price,
        i.category,
        i.dietary_options,
        i.image_url,
        i.quantity as available_quantity
      FROM favorite f
      JOIN inventory i ON f.meal_id = i.meal_id
      WHERE f.user_id = $1
    `;
    
    const params = [userId];
    let paramCount = 1;

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (
        LOWER(i.meal) LIKE LOWER($${paramCount}) OR 
        LOWER(i.description) LIKE LOWER($${paramCount}) OR 
        LOWER(i.category) LIKE LOWER($${paramCount}) OR
        LOWER(i.dietary_options) LIKE LOWER($${paramCount})
      )`;
      params.push(`%${search}%`);
    }

    // Add category filter
    if (category) {
      paramCount++;
      query += ` AND LOWER(i.category) = LOWER($${paramCount})`;
      params.push(category);
    }

    // Add sorting
    const validSortColumns = ['meal_name', 'price', 'created_at', 'favorited_at'];
    const validOrders = ['asc', 'desc'];
    
    if (validSortColumns.includes(sort) && validOrders.includes(order.toLowerCase())) {
      const sortColumn = sort === 'meal_name' ? 'i.meal' : 
                        sort === 'favorited_at' ? 'f.created_at' : 
                        sort === 'created_at' ? 'i.created_at' : 
                        `i.${sort}`;
      query += ` ORDER BY ${sortColumn} ${order.toUpperCase()}`;
    } else {
      query += ` ORDER BY f.created_at DESC`;
    }

    // Add pagination
    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(limit);
    }

    if (offset) {
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(offset);
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  }

  /**
   * Check if a meal is in user's favorites
   * @param {number} userId - User ID
   * @param {number} mealId - Meal ID to check
   * @returns {Promise<Object>} Check result with favorite status
   */
  static async checkFavorite(userId, mealId) {
    const query = `
      SELECT favorite_id, created_at
      FROM favorite 
      WHERE user_id = $1 AND meal_id = $2
    `;
    
    try {
      const result = await db.query(query, [userId, mealId]);
      
      return {
        success: true,
        is_favorite: result.rows.length > 0,
        data: result.rows.length > 0 ? result.rows[0] : null
      };
    } catch (error) {
      console.error('Error checking favorite:', error);
      return {
        success: false,
        is_favorite: false,
        error: error.message
      };
    }
  }

  /**
   * Alias for checkFavorite - check if a meal is in user's favorites
   * @param {number} userId - User ID
   * @param {number} mealId - Meal ID to check
   * @returns {Promise<boolean>} True if meal is favorited, false otherwise
   */
  static async isFavorited(userId, mealId) {
    return await this.checkFavorite(userId, mealId);
  }

  /**
   * Get favorite statistics for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User's favorite statistics
   */
  static async getUserFavoriteStats(userId) {
    const query = `
      SELECT 
        COUNT(f.favorite_id) as total_favorites,
        COUNT(DISTINCT i.category) as categories_count,
        AVG(i.price) as average_price,
        MAX(f.created_at) as most_recent_favorite,
        MIN(f.created_at) as first_favorite,
        json_object_agg(
          COALESCE(i.category, 'Unknown'), 
          category_counts.count
        ) FILTER (WHERE i.category IS NOT NULL) as categories_breakdown
      FROM favorite f
      JOIN inventory i ON f.meal_id = i.meal_id
      LEFT JOIN (
        SELECT 
          i2.category, 
          COUNT(*) as count
        FROM favorite f2
        JOIN inventory i2 ON f2.meal_id = i2.meal_id
        WHERE f2.user_id = $1
        GROUP BY i2.category
      ) category_counts ON i.category = category_counts.category
      WHERE f.user_id = $1
    `;
    
    try {
      const result = await db.query(query, [userId]);
        if (result.rows.length === 0 || result.rows[0].total_favorites === '0') {
        return {
          total_favorites: 0,
          unique_categories: 0,
          average_price: 0,
          most_recent_favorite: null,
          first_favorite: null,
          categories: {}
        };
      }
      
      const stats = result.rows[0];      return {
        total_favorites: parseInt(stats.total_favorites),
        unique_categories: parseInt(stats.categories_count),
        average_price: parseFloat(stats.average_price) || 0,
        most_recent_favorite: stats.most_recent_favorite,
        first_favorite: stats.first_favorite,
        categories: stats.categories_breakdown || {}
      };    } catch (error) {
      console.error('Error getting favorite stats:', error);
      return {
        total_favorites: 0,
        unique_categories: 0,
        average_price: 0,
        most_recent_favorite: null,
        first_favorite: null,
        categories: {}
      };
    }
  }

  /**
   * Alias for getUserFavoriteStats - get user favorite statistics
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User favorite statistics
   */
  static async getFavoriteStats(userId) {
    return await this.getUserFavoriteStats(userId);
  }

  /**
   * Get most favorited meals (popularity)
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of popular meals
   */
  static async getMostFavoritedMeals(options = {}) {
    const { limit = 10, category } = options;
    
    let query = `
      SELECT 
        i.meal_id,
        i.meal as meal_name,
        i.description,
        i.price,
        i.category,
        i.image_url,
        COUNT(f.favorite_id) as favorite_count
      FROM inventory i
      LEFT JOIN favorite f ON i.meal_id = f.meal_id
    `;
    
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` WHERE LOWER(i.category) = LOWER($${paramCount})`;
      params.push(category);
    }

    query += `
      GROUP BY i.meal_id, i.meal, i.description, i.price, i.category, i.image_url
      ORDER BY favorite_count DESC, i.meal ASC
    `;

    if (limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(limit);
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting most favorited meals:', error);
      return [];
    }
  }

  /**
   * Remove all favorites for a user (for account deletion)
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Operation result
   */  static async removeAllUserFavorites(userId) {
    const query = `
      DELETE FROM favorite 
      WHERE user_id = $1
    `;
    
    try {
      const result = await db.query(query, [userId]);
      
      return {
        success: true,
        deleted_count: result.rowCount,
        message: `Removed ${result.rowCount} favorites`
      };
    } catch (error) {
      console.error('Error removing all user favorites:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get total favorites count for a user
   * @param {number} userId - User ID
   * @returns {Promise<number>} Total favorites count
   */
  static async getUserFavoritesCount(userId) {
    const query = `SELECT COUNT(*) as count FROM favorite WHERE user_id = $1`;
    
    try {
      const result = await db.query(query, [userId]);
      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      console.error('Error getting user favorites count:', error);
      return 0;
    }
  }

  /**
   * Alias for getUserFavoritesCount - get count of user's favorites
   * @param {number} userId - User ID
   * @returns {Promise<number>} Number of favorites
   */
  static async getFavoritesCount(userId) {
    return await this.getUserFavoritesCount(userId);
  }

  /**
   * Alias for getMostFavoritedMeals - get most popular favorited meals
   * @param {number} limit - Number of meals to return
   * @returns {Promise<Array>} Array of popular meals
   */
  static async getPopularFavorites(limit = 10) {
    return await this.getMostFavoritedMeals({ limit });
  }
}

module.exports = FavoriteManager;
