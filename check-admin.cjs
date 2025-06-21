const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Bumba_fresh',
  user: 'postgres',
  password: '999999'
});

async function checkAdminAccounts() {
  try {
    console.log('🔍 Checking existing accounts and their roles...\n');
    
    const users = await pool.query(`
      SELECT user_id, email, role, first_name, last_name 
      FROM account 
      ORDER BY user_id
    `);
    
    console.log('📋 All users in database:');
    users.rows.forEach(user => {
      console.log(`   👤 ${user.email} → Role: ${user.role} (${user.first_name || 'N/A'} ${user.last_name || 'N/A'})`);
    });
    
    // Check if admin@gmail.com exists
    const adminCheck = await pool.query(`
      SELECT user_id, email, role, first_name, last_name 
      FROM account 
      WHERE email = 'admin@gmail.com'
    `);
    
    if (adminCheck.rows.length > 0) {
      const admin = adminCheck.rows[0];
      console.log(`\n✅ Admin account found: ${admin.email} → Role: ${admin.role}`);
      
      // Test login credentials
      console.log('\n🔐 Testing admin login credentials...');
      console.log('Email: admin@gmail.com');
      console.log('Try these passwords: admin123, password123, password, 999999');
    } else {
      console.log('\n❌ Admin account (admin@gmail.com) not found');
      console.log('Creating admin account...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await pool.query(`
        INSERT INTO account (email, password, first_name, last_name, role) 
        VALUES ('admin@gmail.com', $1, 'Admin', 'User', 'admin')
      `, [hashedPassword]);
      
      console.log('✅ Admin account created:');
      console.log('   Email: admin@gmail.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdminAccounts();
