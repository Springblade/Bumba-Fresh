#!/usr/bin/env node

/**
 * Database Migration Script for Favorites Table
 * Runs the add-favorite-table.sql migration
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'Bumba_fresh',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '12345',
};

async function runMigration() {
  const pool = new Pool(dbConfig);
  
  try {
    console.log('🚀 Starting favorites table migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'add-favorite-table.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Connect to database
    const client = await pool.connect();
    
    try {
      console.log('📡 Connected to database...');
      
      // Run migration in a transaction
      await client.query('BEGIN');      // Process SQL file more carefully to handle multi-line statements
      // Remove comments and empty lines first, then split by semicolon
      const cleanedSQL = migrationSQL
        .split('\n')
        .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
        .join('\n');
      
      // Split into statements by semicolon and clean up
      const statements = cleanedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('\\'));
      
      console.log(`📝 Found ${statements.length} SQL statements to execute`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`⚡ Executing statement ${i+1}/${statements.length}: ${statement.substring(0, 50)}...`);
        try {
          await client.query(statement);
          console.log(`✅ Statement ${i+1} executed successfully`);
        } catch (error) {
          console.error(`❌ Statement ${i+1} failed: ${error.message}`);
          console.error(`Full statement: ${statement}`);
          throw error;
        }
      }
      
      await client.query('COMMIT');
      
      console.log('✅ Migration completed successfully!');
      
      // Verify table was created
      const verifyResult = await client.query(`
        SELECT table_name, column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'favorite'
        ORDER BY ordinal_position
      `);
      
      if (verifyResult.rows.length > 0) {
        console.log('📋 Table structure verified:');
        verifyResult.rows.forEach(row => {
          console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
      }
      
      // Check indexes
      const indexResult = await client.query(`
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'favorite'
      `);
      
      if (indexResult.rows.length > 0) {
        console.log('📊 Indexes created:');
        indexResult.rows.forEach(row => {
          console.log(`  ${row.indexname}`);
        });
      }
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = runMigration;
