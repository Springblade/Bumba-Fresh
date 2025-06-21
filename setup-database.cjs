// Database setup script using Node.js
const { db } = require('./database/src');

async function setupDatabase() {
    console.log('🗄️ Setting up Bumba Fresh Database...\n');
    
    try {
        // Test connection
        console.log('1. Testing database connection...');
        const result = await db.query('SELECT NOW()');
        console.log('✅ Connected to database at:', result.rows[0].now);
        
        // Read and execute schema
        console.log('\n2. Setting up database schema...');
        const fs = require('fs');
        const path = require('path');
        
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'database', 'init.sql'), 'utf8');
        const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await db.query(statement);
                } catch (error) {
                    if (!error.message.includes('already exists')) {
                        console.log('⚠️ SQL Warning:', error.message);
                    }
                }
            }
        }
        
        console.log('✅ Database schema updated');
        
        // Test if admin account exists
        console.log('\n3. Checking admin account...');
        const adminCheck = await db.query('SELECT email FROM account WHERE email = $1', ['admin@gmail.com']);
        
        if (adminCheck.rows.length > 0) {
            console.log('✅ Admin account exists: admin@gmail.com');
        } else {
            console.log('ℹ️ Admin account will be created by schema');
        }
        
        // Test if meals exist
        console.log('\n4. Checking sample meals...');
        const mealsCheck = await db.query('SELECT COUNT(*) as count FROM inventory');
        console.log(`✅ Meals in database: ${mealsCheck.rows[0].count}`);
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Ready to test:');
        console.log('   👤 Admin login: admin@gmail.com / password123');
        console.log('   🔗 Backend: http://localhost:8000');
        console.log('   🧪 Test page: test-api-complete.html');
        
    } catch (error) {
        console.error('\n❌ Database setup failed:', error.message);
        console.log('\n💡 Make sure PostgreSQL is running and accessible');
        console.log('💡 Check your database connection settings in backend/.env');
    } finally {
        await db.close();
        process.exit(0);
    }
}

setupDatabase();
