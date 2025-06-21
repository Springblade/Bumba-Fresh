const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Bumba_fresh',
  user: 'postgres',
  password: '999999'
});

async function createDietitianAccount() {
  try {
    console.log('👩‍⚕️ Creating dietitian test account...\n');
    
    const email = 'dietitian@bumba.com';
    const password = 'dietitian123';
    const firstName = 'Jane';
    const lastName = 'Nutritionist';
    
    // Check if dietitian account already exists
    const existingCheck = await pool.query(
      'SELECT email, role FROM account WHERE email = $1',
      [email]
    );
    
    if (existingCheck.rows.length > 0) {
      console.log(`ℹ️  Account ${email} already exists with role: ${existingCheck.rows[0].role}`);
      
      // Update to dietitian role if not already
      if (existingCheck.rows[0].role !== 'dietitian') {
        await pool.query(
          'UPDATE account SET role = $1 WHERE email = $2',
          ['dietitian', email]
        );
        console.log('✅ Updated existing account to dietitian role');
      } else {
        console.log('✅ Account already has dietitian role');
      }
    } else {
      // Create new dietitian account
      console.log('🔄 Creating new dietitian account...');
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Insert dietitian account
      const result = await pool.query(`
        INSERT INTO account (password, email, first_name, last_name, role) 
        VALUES ($1, $2, $3, $4, 'dietitian') 
        RETURNING user_id, email, first_name, last_name, role
      `, [hashedPassword, email, firstName, lastName]);
      
      console.log('✅ Dietitian account created:', result.rows[0]);
    }
    
    console.log('\n📋 Test Credentials:');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Password: ${password}`);
    console.log(`   👤 Role: dietitian`);
    
    console.log('\n🎯 Test Instructions:');
    console.log('   1. Start the frontend application');
    console.log('   2. Go to /auth and login with the dietitian credentials');
    console.log('   3. Should automatically redirect to /dietitian dashboard');
    console.log('   4. Verify dietitian-specific interface is displayed');
    
    // Show all role accounts for reference
    console.log('\n📊 All accounts by role:');
    const allRoles = await pool.query(`
      SELECT role, COUNT(*) as count, 
             STRING_AGG(email, ', ') as emails 
      FROM account 
      GROUP BY role 
      ORDER BY role
    `);
    
    allRoles.rows.forEach(roleGroup => {
      console.log(`   ${roleGroup.role}: ${roleGroup.count} account(s)`);
      console.log(`      └── ${roleGroup.emails}`);
    });
    
  } catch (error) {
    console.error('❌ Error creating dietitian account:', error.message);
  } finally {
    await pool.end();
  }
}

createDietitianAccount();
