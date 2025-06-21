const db = require('./connect');

/**
 * Subscription plan manager - JavaScript equivalent of Plan.java
 * Updated to match actual database schema: plan_id, subscription_plan, time_expired, user_id
 */
class PlanManager {
  /**
   * Create a new subscription plan for a user
   * @param {string} subscriptionPlan - Plan type ('basic', 'premium', 'signature')
   * @param {Date} timeExpired - Subscription expiration date
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Operation result
   */
  static async addPlan(subscriptionPlan, timeExpired, userId) {
    const query = `
      INSERT INTO plan (subscription_plan, time_expired, user_id) 
      VALUES ($1, $2, $3) 
      RETURNING plan_id, subscription_plan, time_expired, user_id
    `;
    
    try {
      const result = await db.query(query, [subscriptionPlan, timeExpired, userId]);
      
      return {
        success: true,
        plan: result.rows[0],
        message: 'Subscription plan created successfully'
      };
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all subscription plans for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of user's plans
   */
  static async getUserPlans(userId) {
    const query = `
      SELECT plan_id, subscription_plan, time_expired
      FROM plan 
      WHERE user_id = $1
      ORDER BY plan_id DESC
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting user plans:', error);
      return [];
    }
  }

  /**
   * Get all subscription plans (admin view)
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of all plans
   */
  static async viewAllPlans(filters = {}) {
    let query = `
      SELECT p.plan_id, p.subscription_plan, p.time_expired,
             a.email, a.first_name, a.last_name
      FROM plan p
      JOIN account a ON p.user_id = a.user_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (filters.subscriptionPlan) {
      paramCount++;
      query += ` AND p.subscription_plan = $${paramCount}`;
      params.push(filters.subscriptionPlan);
    }

    query += ' ORDER BY p.plan_id DESC';

    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }
    
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error viewing all plans:', error);
      return [];
    }
  }

  /**
   * Get plan by ID
   * @param {number} planId - Plan ID
   * @returns {Promise<Object|null>} Plan object or null
   */
  static async getPlanById(planId) {
    const query = `
      SELECT p.plan_id, p.subscription_plan, p.time_expired, p.user_id,
             a.email, a.first_name, a.last_name
      FROM plan p
      JOIN account a ON p.user_id = a.user_id
      WHERE p.plan_id = $1
    `;
    
    try {
      const result = await db.query(query, [planId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting plan by ID:', error);
      return null;
    }
  }

  /**
   * Update a subscription plan
   * @param {number} planId - Plan ID
   * @param {Object} updates - Updates object
   * @returns {Promise<Object>} Operation result
   */
  static async updatePlan(planId, updates) {
    const allowedUpdates = ['subscription_plan', 'time_expired'];
    const updateFields = [];
    const params = [];
    let paramCount = 0;

    for (let field of allowedUpdates) {
      if (updates[field] !== undefined) {
        paramCount++;
        updateFields.push(`${field} = $${paramCount}`);
        params.push(updates[field]);
      }
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        message: 'No valid updates provided'
      };
    }

    paramCount++;
    params.push(planId);

    const query = `
      UPDATE plan 
      SET ${updateFields.join(', ')}
      WHERE plan_id = $${paramCount}
      RETURNING plan_id, subscription_plan, time_expired, user_id
    `;
    
    try {
      const result = await db.query(query, params);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Plan not found'
        };
      }
      
      return {
        success: true,
        plan: result.rows[0],
        message: 'Plan updated successfully'
      };
    } catch (error) {
      console.error('Error updating plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete a subscription plan
   * @param {number} planId - Plan ID
   * @returns {Promise<Object>} Operation result
   */
  static async deletePlan(planId) {
    const query = `
      DELETE FROM plan 
      WHERE plan_id = $1
      RETURNING plan_id, subscription_plan
    `;
    
    try {
      const result = await db.query(query, [planId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Plan not found'
        };
      }
      
      return {
        success: true,
        plan: result.rows[0],
        message: 'Plan deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get expired plans
   * @returns {Promise<Array>} Array of expired plans
   */
  static async getExpiredPlans() {
    const query = `
      SELECT p.plan_id, p.subscription_plan, p.time_expired, p.user_id,
             a.email, a.first_name, a.last_name
      FROM plan p
      JOIN account a ON p.user_id = a.user_id
      WHERE p.time_expired < CURRENT_DATE
      ORDER BY p.time_expired ASC
    `;
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting expired plans:', error);
      return [];
    }
  }

  /**
   * Get plans expiring soon
   * @param {number} days - Days to look ahead (default: 7)
   * @returns {Promise<Array>} Array of plans expiring soon
   */
  static async getPlansExpiringSoon(days = 7) {
    const query = `
      SELECT p.plan_id, p.subscription_plan, p.time_expired, p.user_id,
             a.email, a.first_name, a.last_name
      FROM plan p
      JOIN account a ON p.user_id = a.user_id
      WHERE p.time_expired BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
      ORDER BY p.time_expired ASC
    `;
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting plans expiring soon:', error);
      return [];
    }
  }

  /**
   * Get subscription statistics
   * @returns {Promise<Object>} Subscription statistics
   */
  static async getSubscriptionStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_plans,
        COUNT(CASE WHEN subscription_plan = 'basic' THEN 1 END) as basic_plans,
        COUNT(CASE WHEN subscription_plan = 'premium' THEN 1 END) as premium_plans,
        COUNT(CASE WHEN subscription_plan = 'signature' THEN 1 END) as signature_plans,
        COUNT(CASE WHEN time_expired < CURRENT_DATE THEN 1 END) as expired_plans,
        COUNT(CASE WHEN time_expired >= CURRENT_DATE THEN 1 END) as active_plans
      FROM plan
    `;
    
    try {
      const result = await db.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting subscription statistics:', error);
      return {};
    }
  }
}

module.exports = PlanManager;
