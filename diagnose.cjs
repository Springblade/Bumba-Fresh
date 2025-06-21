console.log('🔍 Diagnosing issues...');

// Check environment
console.log('1. Node.js version:', process.version);
console.log('2. Current directory:', process.cwd());

// Test database connection
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Bumba_fresh',
  user: 'postgres',
  password: '999999'
});

console.log('3. Testing database connection...');

pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected:', result.rows[0].now);
  }
  
  // Test account query
  pool.query('SELECT user_id, email FROM account LIMIT 3', (err, result) => {
    if (err) {
      console.error('❌ Account query failed:', err.message);
    } else {
      console.log('✅ Found accounts:', result.rows.length);
      result.rows.forEach(row => {
        console.log(`  - User ${row.user_id}: ${row.email}`);
      });
    }
    
    pool.end();
    console.log('4. Database connection closed.');
  });
});

// Test bcrypt
try {
  const bcrypt = require('bcryptjs');
  console.log('5. bcrypt module loaded successfully');
  
  // Test password hashing
  const testPassword = 'admin123';
  bcrypt.hash(testPassword, 12, (err, hash) => {
    if (err) {
      console.error('❌ bcrypt hash failed:', err.message);
    } else {
      console.log('✅ bcrypt hash created');
      
      // Test password verification
      bcrypt.compare(testPassword, hash, (err, result) => {
        if (err) {
          console.error('❌ bcrypt compare failed:', err.message);
        } else {
          console.log('✅ bcrypt verification:', result);
        }
      });
    }
  });
} catch (error) {
  console.error('❌ bcrypt module error:', error.message);
}
