const { Pool } = require('pg');
// const redis = require('redis');

// PostgreSQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'Bumba_fresh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create PostgreSQL connection pool
const pool = new Pool(dbConfig);

// // Redis client configuration
// const redisClient = redis.createClient({
//   url: process.env.REDIS_URL || 'redis://redis:6379'
// });

// // Handle Redis connection
// redisClient.on('error', (err) => {
//   console.error('Redis connection error:', err);
// });

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// // Connect to Redis
// redisClient.connect().catch(console.error);

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Database query helper function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Transaction helper function
const transaction = async (queries) => {
  const client = await pool.connect();
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
};

module.exports = {
  pool,
  query,
  transaction,
  // redisClient
};
