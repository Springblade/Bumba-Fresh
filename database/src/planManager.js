const db = require('./connect');

/**
 * Subscription plan manager - JavaScript equivalent of Plan.java
 * Enhanced with comprehensive subscription management functionality
 */
class PlanManager {
  /**
   * Create a new subscription plan for a user
   * @param {string} subscriptionPlan - Plan type ('basic', 'premium', 'signature')
   * @param {number} mealsPerWeek - Number of meals per week
   * @param {number} pricePerMeal - Price per meal
   * @param {string} billingCycle - Billing cycle ('weekly' or 'monthly')
   * @param {Date} startDate - Subscription start date
   * @param {Date} timeExpired - Subscription expiration date
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Operation result
   */
  static async addPlan(subscriptionPlan, mealsPerWeek, pricePerMeal, billingCycle, startDate, timeExpired, userId) {
    const query = `
      INSERT INTO plan (subscription_plan, meals_per_week, price_per_meal, billing_cycle, start_date, time_expired, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING plan_id, subscription_plan, meals_per_week, price_per_meal, billing_cycle, start_date, time_expired, user_id, created_at
    `;
    
    try {
      const result = await db.query(query, [
        subscriptionPlan, mealsPerWeek, pricePerMeal, billingCycle, startDate, timeExpired, userId
      ]);
      
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
   * Get all active subscription plans for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of user's active plans
   */
  static async getUserPlans(userId) {
    const query = `
      SELECT plan_id, subscription_plan, meals_per_week, price_per_meal, 
             billing_cycle, start_date, time_expired, is_active, created_at, updated_at
      FROM plan 
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC
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
      SELECT p.plan_id, p.subscription_plan, p.meals_per_week, p.price_per_meal, 
             p.billing_cycle, p.start_date, p.time_expired, p.is_active, 
             p.created_at, p.updated_at,
             a.username, a.email, a.first_name, a.last_name
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

    if (filters.isActive !== undefined) {
      paramCount++;
      query += ` AND p.is_active = $${paramCount}`;
      params.push(filters.isActive);
    }

    if (filters.billingCycle) {
      paramCount++;
      query += ` AND p.billing_cycle = $${paramCount}`;
      params.push(filters.billingCycle);
    }

    query += ' ORDER BY p.created_at DESC';

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
      SELECT p.plan_id, p.subscription_plan, p.meals_per_week, p.price_per_meal, 
             p.billing_cycle, p.start_date, p.time_expired, p.is_active, 
             p.created_at, p.updated_at, p.user_id,
             a.username, a.email, a.first_name, a.last_name
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
   * Update subscription plan
   * @param {number} planId - Plan ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Operation result
   */
  static async updatePlan(planId, updates) {
    const allowedFields = [
      'subscription_plan', 'meals_per_week', 'price_per_meal', 
      'billing_cycle', 'time_expired', 'is_active'
    ];
    
    const setFields = [];
    const params = [];
    let paramCount = 0;

    // Build dynamic update query
    for (const [field, value] of Object.entries(updates)) {
      if (allowedFields.includes(field)) {
        paramCount++;
        setFields.push(`${field} = $${paramCount}`);
        params.push(value);
      }
    }

    if (setFields.length === 0) {
      return {
        success: false,
        message: 'No valid fields to update'
      };
    }

    paramCount++;
    params.push(planId);

    const query = `
      UPDATE plan 
      SET ${setFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE plan_id = $${paramCount}
      RETURNING plan_id, subscription_plan, meals_per_week, price_per_meal, billing_cycle, updated_at
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
   * Cancel subscription plan
   * @param {number} planId - Plan ID
   * @returns {Promise<Object>} Operation result
   */
  static async cancelPlan(planId) {
    const query = `
      UPDATE plan 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE plan_id = $1 AND is_active = true
      RETURNING plan_id, subscription_plan, is_active, updated_at
    `;
    
    try {
      const result = await db.query(query, [planId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Plan not found or already cancelled'
        };
      }
      
      return {
        success: true,
        plan: result.rows[0],
        message: 'Plan cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling plan:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reactivate subscription plan
   * @param {number} planId - Plan ID
   * @param {Date} newExpirationDate - New expiration date
   * @returns {Promise<Object>} Operation result
   */
  static async reactivatePlan(planId, newExpirationDate) {
    const query = `
      UPDATE plan 
      SET is_active = true, time_expired = $1, updated_at = CURRENT_TIMESTAMP
      WHERE plan_id = $2
      RETURNING plan_id, subscription_plan, is_active, time_expired, updated_at
    `;
    
    try {
      const result = await db.query(query, [newExpirationDate, planId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Plan not found'
        };
      }
      
      return {
        success: true,
        plan: result.rows[0],
        message: 'Plan reactivated successfully'
      };
    } catch (error) {
      console.error('Error reactivating plan:', error);
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
             a.username, a.email, a.first_name, a.last_name
      FROM plan p
      JOIN account a ON p.user_id = a.user_id
      WHERE p.is_active = true AND p.time_expired < CURRENT_DATE
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
   * Get subscription statistics
   * @returns {Promise<Object>} Subscription statistics
   */
  static async getSubscriptionStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_subscriptions,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_subscriptions,
        COUNT(CASE WHEN subscription_plan = 'basic' THEN 1 END) as basic_plans,
        COUNT(CASE WHEN subscription_plan = 'premium' THEN 1 END) as premium_plans,
        COUNT(CASE WHEN subscription_plan = 'signature' THEN 1 END) as signature_plans,
        COUNT(CASE WHEN billing_cycle = 'weekly' THEN 1 END) as weekly_billing,
        COUNT(CASE WHEN billing_cycle = 'monthly' THEN 1 END) as monthly_billing,
        AVG(price_per_meal) as average_price_per_meal
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

  /**
   * Get plans expiring soon (within specified days)
   * @param {number} days - Number of days ahead to check (default: 7)
   * @returns {Promise<Array>} Array of plans expiring soon
   */
  static async getPlansExpiringSoon(days = 7) {
    const query = `
      SELECT p.plan_id, p.subscription_plan, p.time_expired, p.user_id,
             a.username, a.email, a.first_name, a.last_name
      FROM plan p
      JOIN account a ON p.user_id = a.user_id
      WHERE p.is_active = true 
        AND p.time_expired > CURRENT_DATE 
        AND p.time_expired <= CURRENT_DATE + INTERVAL '$1 days'
      ORDER BY p.time_expired ASC
    `;
    
    try {
      const result = await db.query(query, [days]);
      return result.rows;
    } catch (error) {
      console.error('Error getting plans expiring soon:', error);
      return [];
    }
  }
}

module.exports = PlanManager;
