const bcrypt = require('bcryptjs');
const db = require('./connect');

/**
 * Login utility - JavaScript equivalent of LogIn.java
 * Enhanced with proper password verification and security
 */
class LoginManager {
  /**
   * Authenticate user login
   * @param {string} identifier - Username or email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result
   */
  static async loginAccount(identifier, password) {
    try {
      // Get user data including hashed password
      const user = await this.getUserWithPassword(identifier);
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Remove password from user object before returning
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Error during login:', error);
      return {
        success: false,
        message: 'Login failed due to server error'
      };
    }
  }

  /**
   * Get user data including password hash by username or email
   * @param {string} identifier - Username or email
   * @returns {Promise<Object|null>} User object with password or null
   */
  static async getUserWithPassword(identifier) {
    const query = `
      SELECT user_id, username, password, email, first_name, last_name, phone, address, created_at 
      FROM account 
      WHERE username = $1 OR email = $1
    `;
    
    try {
      const result = await db.query(query, [identifier]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting user with password:', error);
      return null;
    }
  }

  /**
   * Verify password against hash
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password is valid
   */
  static async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  /**
   * Check if user exists (without password verification)
   * @param {string} identifier - Username or email
   * @returns {Promise<boolean>} True if user exists
   */
  static async userExists(identifier) {
    const query = `
      SELECT user_id 
      FROM account 
      WHERE username = $1 OR email = $1
    `;
    
    try {
      const result = await db.query(query, [identifier]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }

  /**
   * Get user profile data (without password)
   * @param {string} identifier - Username or email
   * @returns {Promise<Object|null>} User profile or null
   */
  static async getUserProfile(identifier) {
    const query = `
      SELECT user_id, username, email, first_name, last_name, phone, address, created_at, updated_at 
      FROM account 
      WHERE username = $1 OR email = $1
    `;
    
    try {
      const result = await db.query(query, [identifier]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user's last login timestamp
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} True if successful
   */
  static async updateLastLogin(userId) {
    const query = `
      UPDATE account 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE user_id = $1
    `;
    
    try {
      await db.query(query, [userId]);
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }
}

module.exports = LoginManager;
