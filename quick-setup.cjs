// Quick database setup and backend restart script
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mealkits',
  user: 'postgres',
  password: '22092004A'
});

async function setupAndRestart() {
  console.log('🔧 Quick Setup and Restart...\n');
  
  try {
    // Test database connection
    console.log('1. Testing database connection...');
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', testResult.rows[0].now);
    
    // Run database schema
    console.log('\n2. Setting up database schema...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'database', 'init.sql'), 'utf8');
    
    // Split into individual statements and execute
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.log('⚠️ SQL Warning:', error.message);
          }
        }
      }
    }
    
    console.log('✅ Database schema updated');
    
    // Test if delivery table exists
    console.log('\n3. Checking delivery table...');
    const deliveryCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'delivery'
    `);
    
    if (deliveryCheck.rows.length > 0) {
      console.log('✅ Delivery table exists with columns:');
      deliveryCheck.rows.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
    } else {
      console.log('❌ Delivery table not found');
    }
    
    // Test admin account
    console.log('\n4. Checking admin account...');
    const adminCheck = await pool.query('SELECT email FROM account WHERE email = $1', ['admin@gmail.com']);
    console.log(`✅ Admin account: ${adminCheck.rows.length > 0 ? 'exists' : 'not found'}`);
    
    // Test meals
    console.log('\n5. Checking meals...');
    const mealsCheck = await pool.query('SELECT COUNT(*) as count FROM inventory');
    console.log(`✅ Meals count: ${mealsCheck.rows[0].count}`);
    
    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start backend: cd backend && npm run dev');
    console.log('   2. Test with: http://localhost:3000/test-auth-fix.html');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Make sure PostgreSQL is running');
  } finally {
    await pool.end();
  }
}

setupAndRestart();
