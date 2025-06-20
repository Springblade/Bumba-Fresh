const bcrypt = require('bcryptjs');
const db = require('./connect');

/**
 * Profile management utility for user profile operations
 * Handles viewing and updating user profile information
 */
class ProfileManager {
  /**
   * Get user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} User profile or null
   */
  static async getUserProfileById(userId) {
    const query = `
      SELECT user_id, username, email, first_name, last_name, phone, address, 
             created_at, updated_at, last_login
      FROM account 
      WHERE user_id = $1
    `;
    
    try {
      const result = await db.query(query, [userId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting user profile by ID:', error);
      return null;
    }
  }

  /**
   * Update user profile information
   * @param {number} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Operation result
   */
  static async updateUserProfile(userId, profileData) {
    try {
      const allowedFields = ['first_name', 'last_name', 'phone', 'address'];
      const updates = [];
      const values = [];
      let paramCount = 0;

      // Build dynamic update query based on provided fields
      for (const [key, value] of Object.entries(profileData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          paramCount++;
          updates.push(`${key} = $${paramCount}`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        return {
          success: false,
          message: 'No valid fields provided for update'
        };
      }

      // Add updated_at timestamp
      paramCount++;
      updates.push(`updated_at = $${paramCount}`);
      values.push(new Date());

      // Add user_id for WHERE clause
      paramCount++;
      values.push(userId);

      const query = `
        UPDATE account 
        SET ${updates.join(', ')}
        WHERE user_id = $${paramCount}
        RETURNING user_id, username, email, first_name, last_name, phone, address, updated_at
      `;

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        user: result.rows[0],
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }

  /**
   * Check if email is available for user (excluding current user)
   * @param {string} email - Email to check
   * @param {number} userId - Current user ID to exclude
   * @returns {Promise<boolean>} True if email is available
   */
  static async isEmailAvailable(email, userId) {
    const query = `
      SELECT user_id 
      FROM account 
      WHERE email = $1 AND user_id != $2
    `;
    
    try {
      const result = await db.query(query, [email, userId]);
      return result.rows.length === 0;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  }

  /**
   * Update user password
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Operation result
   */
  static async updatePassword(userId, currentPassword, newPassword) {
    try {
      // First get current password hash
      const userQuery = 'SELECT password FROM account WHERE user_id = $1';
      const userResult = await db.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const updateQuery = `
        UPDATE account 
        SET password = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
      `;

      await db.query(updateQuery, [hashedNewPassword, userId]);

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Error updating password:', error);
      return {
        success: false,
        message: 'Failed to update password'
      };
    }
  }

  /**
   * Get user profile statistics
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User statistics
   */
  static async getUserStats(userId) {
    try {
      // Get order count and total spent
      const orderQuery = `
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total_price), 0) as total_spent,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
        FROM "order"
        WHERE user_id = $1
      `;

      // Get active subscription count
      const subscriptionQuery = `
        SELECT COUNT(*) as active_subscriptions
        FROM plan
        WHERE user_id = $1 AND is_active = true
      `;

      const [orderResult, subscriptionResult] = await Promise.all([
        db.query(orderQuery, [userId]),
        db.query(subscriptionQuery, [userId])
      ]);

      return {
        totalOrders: parseInt(orderResult.rows[0].total_orders),
        totalSpent: parseFloat(orderResult.rows[0].total_spent),
        deliveredOrders: parseInt(orderResult.rows[0].delivered_orders),
        activeSubscriptions: parseInt(subscriptionResult.rows[0].active_subscriptions)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        deliveredOrders: 0,
        activeSubscriptions: 0
      };
    }
  }
}

module.exports = ProfileManager;
