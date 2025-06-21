const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Bumba_fresh',
  user: 'postgres',
  password: '999999'
});

async function applyRoleMigrationStep() {
  try {
    console.log('🔄 Applying role column migration step by step...');
    
    // Step 1: Add role column
    console.log('\n1️⃣ Adding role column...');
    await pool.query(`
      ALTER TABLE account 
      ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' 
      CHECK (role IN ('user', 'admin', 'dietitian'))
    `);
    console.log('✅ Role column added successfully');
    
    // Step 2: Update admin account
    console.log('\n2️⃣ Updating admin account role...');
    const updateResult = await pool.query(`
      UPDATE account 
      SET role = 'admin' 
      WHERE email = 'admin@gmail.com'
      RETURNING email, role
    `);
    
    if (updateResult.rows.length > 0) {
      console.log('✅ Admin account updated:', updateResult.rows[0]);
    } else {
      console.log('⚠️  No admin account found with email admin@gmail.com');
    }
    
    // Step 3: Create index
    console.log('\n3️⃣ Creating index on role column...');
    await pool.query(`CREATE INDEX idx_account_role ON account(role)`);
    console.log('✅ Index created successfully');
    
    // Step 4: Verify results
    console.log('\n4️⃣ Verifying all users and their roles...');
    const allUsers = await pool.query(`
      SELECT user_id, email, role, created_at 
      FROM account 
      ORDER BY created_at DESC
    `);
    
    console.log('📊 All users in database:');
    allUsers.rows.forEach(user => {
      console.log(`   👤 ID: ${user.user_id}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    console.log('\n🎉 Role-based access control migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Role column might already exist. Let\'s check...');
      
      const checkResult = await pool.query(`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns 
        WHERE table_name = 'account' AND column_name = 'role'
      `);
      
      if (checkResult.rows.length > 0) {
        console.log('✅ Role column already exists:', checkResult.rows[0]);
      }
    }
  } finally {
    await pool.end();
  }
}

applyRoleMigrationStep();
