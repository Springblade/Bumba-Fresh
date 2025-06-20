const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mealkits',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '22092004A'
});

async function verifyEmpty() {
  try {
    console.log('🔍 Verifying all tables are empty...\n');
    
    const tables = ['account', 'delivery', 'inventory', 'order', 'order_meal', 'plan'];
    let totalRecords = 0;
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM "${table}"`);
      const count = parseInt(result.rows[0].count);
      totalRecords += count;
      
      const status = count === 0 ? '✅' : '❌';
      console.log(`${status} ${table}: ${count} records`);
    }
    
    console.log('\n' + '='.repeat(30));
    if (totalRecords === 0) {
      console.log('✅ SUCCESS: All tables are empty!');
      console.log('🎉 Database has been completely cleared.');
    } else {
      console.log(`❌ INCOMPLETE: ${totalRecords} total records remaining`);
      console.log('💡 Some data was not deleted successfully.');
    }
    
  } catch (error) {
    console.error('❌ Error verifying:', error.message);
  } finally {
    await pool.end();
  }
}

verifyEmpty();
