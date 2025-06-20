// Reset admin password to a known value
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mealkits',
  user: 'postgres',
  password: '22092004A'
});

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...');
    
    const newPassword = 'admin123';
    const saltRounds = 12;
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log('✅ Password hashed');
    
    // Update the admin account
    const result = await pool.query(
      'UPDATE account SET password = $1 WHERE email = $2 RETURNING user_id, email',
      [hashedPassword, 'admin@gmail.com']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Admin password updated successfully');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: admin123');
      console.log('👤 User ID:', result.rows[0].user_id);
    } else {
      console.log('❌ Admin account not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

resetAdminPassword();
