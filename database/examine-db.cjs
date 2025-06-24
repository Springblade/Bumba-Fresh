const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'Bumba_fresh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '12345'
});

async function examineDatabase() {
  try {
    console.log('🔍 Examining actual database tables...\n');
    
    // Get all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in your database:');
    console.log('================================');
    tablesResult.rows.forEach(row => {
      console.log('- ' + row.table_name);
    });
    
    console.log('\n🏗️ Detailed table structures:\n');
    
    // For each table, get its structure
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      console.log(`📊 Table: ${tableName.toUpperCase()}`);
      console.log('----------------------------');
      
      const columnsResult = await pool.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      columnsResult.rows.forEach(col => {
        const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`);
      });
      
      // Get row count
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      console.log(`  → ${countResult.rows[0].count} records\n`);
    }
    
    console.log('🔗 Foreign Key Relationships:');
    console.log('===============================');
    
    const fkResult = await pool.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `);
    
    fkResult.rows.forEach(fk => {
      console.log(`${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error examining database:', error.message);
    console.error('💡 Make sure PostgreSQL is running and credentials are correct');
  } finally {
    await pool.end();
  }
}

examineDatabase();
