const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mealkits',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '22092004A'
});

async function truncateAllTables() {
  try {
    console.log('🗑️  TRUNCATING all tables (force delete)...\n');
    
    // Get all table names
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tableNames = tablesResult.rows.map(row => `"${row.table_name}"`).join(', ');
    console.log('📋 Tables to truncate:', tableNames);
    
    // Use TRUNCATE CASCADE to delete all data and reset sequences
    console.log('\n🔨 Executing TRUNCATE CASCADE...');
    await pool.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE`);
    
    console.log('✅ All tables truncated successfully!');
    console.log('🔄 Auto-increment sequences have been reset to 1');
    
    // Verify
    console.log('\n🔍 Verification:');
    const tables = ['account', 'delivery', 'inventory', 'order', 'order_meal', 'plan'];
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM "${table}"`);
      console.log(`   ${table}: ${result.rows[0].count} records`);
    }
    
  } catch (error) {
    console.error('❌ Error truncating tables:', error.message);
    console.error('💡 Make sure you have sufficient database privileges');
  } finally {
    await pool.end();
  }
}

truncateAllTables();
