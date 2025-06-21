// Simple test script to check database contents and password verification
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Bumba_fresh',
  user: 'postgres',
  password: '999999'
});

async function testDatabase() {
  try {
    console.log('🔍 Checking database contents...');
    
    // Check all users
    const usersResult = await pool.query('SELECT user_id, email, first_name, last_name FROM account LIMIT 5');
    console.log('\nUsers in database:');
    usersResult.rows.forEach(user => {
      console.log(`- ID: ${user.user_id}, Email: ${user.email}, Name: ${user.first_name} ${user.last_name}`);
    });
    
    // Check specific user
    const userResult = await pool.query('SELECT user_id, email, password FROM account WHERE email = $1', ['admin@gmail.com']);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('\nAdmin user found:');
      console.log(`- ID: ${user.user_id}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Password hash: ${user.password.substring(0, 20)}...`);
      
      // Test password verification
      console.log('\nTesting password verification:');
      const passwords = ['admin123', '123', 'admin'];
      
      for (const pwd of passwords) {
        const isValid = await bcrypt.compare(pwd, user.password);
        console.log(`- "${pwd}": ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      }
      
    } else {
      console.log('\n❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();
