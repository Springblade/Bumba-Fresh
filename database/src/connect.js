const { Pool } = require('pg');

/**
 * Database connection utility - JavaScript equivalent of Connect.java
 * Enhanced with environment variables and connection pooling
 */
class DatabaseConnection {
  constructor() {    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'Bumba_fresh',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '999999',
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });

    // Handle pool events
    this.pool.on('connect', () => {
      console.log('Connected to PostgreSQL database');
    });

    this.pool.on('error', (err) => {
      console.error('PostgreSQL connection error:', err);
    });
  }

  /**
   * Get a connection from the pool
   * @returns {Promise<Object>} Database client
   */
  async getConnection() {
    try {
      const client = await this.pool.connect();
      return client;
    } catch (error) {
      console.error('Error getting database connection:', error);
      throw error;
    }
  }

  /**
   * Execute a query with parameters
   * @param {string} text - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async query(text, params = []) {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  /**
   * Execute multiple queries in a transaction
   * @param {Array} queries - Array of {text, params} objects
   * @returns {Promise<Array>} Array of query results
   */
  async transaction(queries) {
    const client = await this.getConnection();
    try {
      await client.query('BEGIN');
      const results = [];
      
      for (const { text, params } of queries) {
        const result = await client.query(text, params);
        results.push(result);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Close the connection pool
   */
  async close() {
    await this.pool.end();
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

module.exports = dbConnection;
