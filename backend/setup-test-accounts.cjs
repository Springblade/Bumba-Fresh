require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'Bumba_fresh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '999999',
});

async function testDatabaseAndCreateAccounts() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Check if account table exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'account'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Account table does not exist');
      client.release();
      return;
    }
    
    console.log('✅ Account table exists');
    
    // Check current accounts
    const currentAccounts = await client.query('SELECT email, role FROM account');
    console.log('\n📋 Current accounts in database:');
    currentAccounts.rows.forEach(account => {
      console.log(`  - ${account.email} (${account.role})`);
    });
    
    // Create test accounts if they don't exist
    const testAccounts = [
      {
        email: 'admin@bumba.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      },
      {
        email: 'dietitian@bumba.com',
        password: 'dietitian123',
        first_name: 'Dietitian',
        last_name: 'User',
        role: 'dietitian'
      },
      {
        email: 'user@bumba.com',
        password: 'user123',
        first_name: 'Regular',
        last_name: 'User',
        role: 'user'
      }
    ];
    
    console.log('\n🔨 Creating/updating test accounts...');
    
    for (const account of testAccounts) {
      // Check if account exists
      const existingAccount = await client.query(
        'SELECT email FROM account WHERE email = $1',
        [account.email]
      );
      
      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 12);
      
      if (existingAccount.rows.length > 0) {
        // Update existing account
        await client.query(`
          UPDATE account 
          SET password = $1, first_name = $2, last_name = $3, role = $4
          WHERE email = $5
        `, [hashedPassword, account.first_name, account.last_name, account.role, account.email]);
        
        console.log(`  ✅ Updated ${account.email} (${account.role})`);
      } else {
        // Create new account
        await client.query(`
          INSERT INTO account (email, password, first_name, last_name, role, phone, address)
          VALUES ($1, $2, $3, $4, $5, '', '')
        `, [account.email, hashedPassword, account.first_name, account.last_name, account.role]);
        
        console.log(`  ✅ Created ${account.email} (${account.role})`);
      }
    }
    
    // Verify accounts after creation
    console.log('\n📋 Final accounts in database:');
    const finalAccounts = await client.query('SELECT email, role, first_name, last_name FROM account');
    finalAccounts.rows.forEach(account => {
      console.log(`  - ${account.email} (${account.role}) - ${account.first_name} ${account.last_name}`);
    });
    
    console.log('\n🧪 Testing password verification...');
    for (const account of testAccounts) {
      const dbAccount = await client.query(
        'SELECT password FROM account WHERE email = $1',
        [account.email]
      );
      
      if (dbAccount.rows.length > 0) {
        const isValid = await bcrypt.compare(account.password, dbAccount.rows[0].password);
        console.log(`  ${account.email}: ${account.password} - ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      }
    }
    
    client.release();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabaseAndCreateAccounts();
