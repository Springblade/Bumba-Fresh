const bcrypt = require('bcryptjs');
const db = require('./connect');

/**
 * Login utility - JavaScript equivalent of LogIn.java
 * Enhanced with proper password verification and security
 */
class LoginManager {  /**
   * Authenticate user login
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Authentication result
   */
  static async loginAccount(email, password) {
    try {
      // Get user data including hashed password
      const user = await this.getUserWithPassword(email);
      
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
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
   * Get user data including password hash by email
   * @param {string} identifier - Email (username support removed)
   * @returns {Promise<Object|null>} User object with password or null
   */
  static async getUserWithPassword(identifier) {
    const query = `
      SELECT user_id, password, email, first_name, last_name, phone, address 
      FROM account 
      WHERE email = $1
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
   * @param {string} identifier - Email (username support removed)
   * @returns {Promise<boolean>} True if user exists
   */
  static async userExists(identifier) {
    const query = `
      SELECT user_id 
      FROM account 
      WHERE email = $1
    `;
    
    try {
      const result = await db.query(query, [identifier]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }  /**
   * Get user profile data (without password)
   * @param {string} identifier - Email (username support removed)
   * @returns {Promise<Object|null>} User profile or null
   */
  static async getUserProfile(identifier) {
    const query = `
      SELECT user_id, email, first_name, last_name, phone, address 
      FROM account 
      WHERE email = $1
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
   * Get user by ID (without password)
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User profile result
   */
  static async getUserById(userId) {
    const query = `
      SELECT user_id, email, first_name, last_name, phone, address 
      FROM account 
      WHERE user_id = $1
    `;
    
    try {
      const result = await db.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      const user = result.rows[0];
      return {
        success: true,
        user: {
          id: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          address: user.address
        }
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return {
        success: false,
        message: 'Failed to retrieve user'
      };
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
