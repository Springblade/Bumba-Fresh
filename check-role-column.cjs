const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'Bumba_fresh',
  user: 'postgres',
  password: '999999'
});

async function checkRoleColumn() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'account' 
      ORDER BY ordinal_position
    `);
    
    console.log('Account table columns:');
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });
    
    // Check if role column exists
    const roleColumn = result.rows.find(row => row.column_name === 'role');
    if (roleColumn) {
      console.log('\n✓ Role column already exists');
    } else {
      console.log('\n✗ Role column does not exist');
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkRoleColumn();
