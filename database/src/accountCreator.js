const bcrypt = require('bcryptjs');
const db = require('./connect');

/**
 * Account creation utility - JavaScript equivalent of Create.java
 * Enhanced with proper password hashing and parameterized queries
 * 
 * Actual database schema for account table:
 * - user_id: integer (PRIMARY KEY, AUTO_INCREMENT)
 * - password: text
 * - email: character varying
 * - first_name: character varying
 * - last_name: character varying  
 * - phone: character varying
 * - address: text
 */
class AccountCreator {
  /**
   * Create a new user account
   * @param {string} password - User's password (will be hashed)
   * @param {string} email - User's email
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @param {string} phone - User's phone number
   * @param {string} address - User's address
   * @returns {Promise<Object>} Created user object or error
   */
  static async createAccount(password, email = null, firstName = null, lastName = null, phone = null, address = null) {
    try {
      // Check if email is unique (if provided)
      if (email) {
        const isEmailUnique = await this.isEmailUnique(email);
        if (!isEmailUnique) {
          throw new Error('Email already exists');
        }
      }

      // Hash the password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user (user_id will auto-increment)
      const result = await this.insertUser(hashedPassword, email, firstName, lastName, phone, address);
      
      return {
        success: true,
        user: result.rows[0],
        message: 'Account created successfully'
      };
    } catch (error) {
      console.error('Error creating account:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  /**
   * Insert a new user into the database
   * @param {string} hashedPassword - Hashed password
   * @param {string} email - Email
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} phone - Phone number
   * @param {string} address - Address
   * @returns {Promise<Object>} Database result
   */  static async insertUser(hashedPassword, email, firstName, lastName, phone, address) {
    const query = `
      INSERT INTO account (password, email, first_name, last_name, phone, address, role)
      VALUES ($1, $2, $3, $4, $5, $6, 'user') 
      RETURNING user_id, email, first_name, last_name, phone, address, role
    `;
    
    const params = [hashedPassword, email, firstName, lastName, phone, address];
    
    try {
      const result = await db.query(query, params);
      return result;
    } catch (error) {
      console.error('Error inserting user:', error);
      throw error;
    }
  }
  /**
   * Check if username is unique
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if unique, false otherwise
   */
  static async isUsernameUnique(username) {
    // Username column has been removed - always return true
    return true;
  }

  /**
   * Check if email is unique
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if unique, false otherwise
   */
  static async isEmailUnique(email) {
    const query = 'SELECT user_id FROM account WHERE email = $1';
    
    try {
      const result = await db.query(query, [email]);
      return result.rows.length === 0;
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      return false;
    }
  }  /**
   * Get user by email
   * @param {string} email - Email to search for
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getUserByEmail(email) {
    const query = `
      SELECT user_id, email, first_name, last_name, phone, address, role
      FROM account 
      WHERE email = $1
    `;
      try {
      const result = await db.query(query, [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }  }
}

module.exports = AccountCreator;
