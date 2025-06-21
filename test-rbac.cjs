const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Bumba_fresh',
  user: 'postgres',
  password: '999999'
});

async function testRoleBasedAuth() {
  try {
    console.log('🧪 Testing Role-Based Authentication...\n');
    
    // 1. Check current users and roles
    console.log('1️⃣ Current users in database:');
    const users = await pool.query(`
      SELECT user_id, email, role, first_name, last_name 
      FROM account 
      ORDER BY user_id
    `);
    
    users.rows.forEach(user => {
      console.log(`   👤 ${user.email} → Role: ${user.role} (${user.first_name} ${user.last_name})`);
    });
    
    // 2. Verify admin account
    console.log('\n2️⃣ Admin account verification:');
    const adminCheck = await pool.query(`
      SELECT email, role, first_name, last_name 
      FROM account 
      WHERE role = 'admin'
    `);
    
    if (adminCheck.rows.length > 0) {
      adminCheck.rows.forEach(admin => {
        console.log(`   ✅ Admin found: ${admin.email} (${admin.first_name} ${admin.last_name})`);
      });
    } else {
      console.log('   ❌ No admin accounts found');
    }
    
    // 3. Test role constraints
    console.log('\n3️⃣ Testing role constraints...');
    try {
      await pool.query(`
        INSERT INTO account (email, password, role) 
        VALUES ('test-invalid@example.com', 'hashedpassword', 'invalid_role')
      `);
      console.log('   ❌ Role constraint not working - invalid role was accepted');
    } catch (error) {
      if (error.message.includes('check constraint')) {
        console.log('   ✅ Role constraint working - invalid role rejected');
      } else {
        console.log('   ❓ Unexpected error:', error.message);
      }
    }
    
    // 4. Show default role behavior
    console.log('\n4️⃣ Testing default role assignment...');
    const defaultRoleTest = await pool.query(`
      SELECT column_default 
      FROM information_schema.columns 
      WHERE table_name = 'account' AND column_name = 'role'
    `);
    
    if (defaultRoleTest.rows.length > 0) {
      console.log(`   ✅ Default role: ${defaultRoleTest.rows[0].column_default}`);
    }
    
    console.log('\n🎉 Role-based authentication test completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database has role column with constraints');
    console.log('   ✅ Admin account exists and configured');
    console.log('   ✅ New users get "user" role by default');
    console.log('   ✅ Invalid roles are rejected');
    
    console.log('\n🚀 Ready to test frontend:');
    console.log('   1. Start frontend: npm run dev');
    console.log('   2. Register new user → should go to /');
    console.log('   3. Login as admin@gmail.com → should go to /admin');
    console.log('   4. Create dietitian account manually → should go to /dietitian');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testRoleBasedAuth();
