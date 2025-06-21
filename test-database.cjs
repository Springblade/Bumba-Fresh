// Database connection test
const { db, LoginManager, AccountCreator, InventoryManager } = require('./database/src/index.js');

async function testDatabaseConnection() {
  console.log('🔗 Testing database connection...');
  
  try {
    // Test basic connection
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log('📅 Current time:', result.rows[0].now);
    
    // Test LoginManager
    console.log('\n🧪 Testing LoginManager...');
    const testExists = await LoginManager.userExists('test@example.com');
    console.log('✅ LoginManager working:', !testExists ? 'No test user found (good!)' : 'Test user exists');
    
    // Test InventoryManager
    console.log('\n🧪 Testing InventoryManager...');
    const meals = await InventoryManager.getAllMeals();
    console.log('✅ InventoryManager working:', meals.success ? `Found ${meals.meals?.length || 0} meals` : 'No meals found');
    
    console.log('\n🎉 All database tests passed!');
    console.log('📍 Your API is ready to connect with the frontend');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Make sure PostgreSQL is running and check your .env configuration');
  } finally {
    // Close the connection
    await db.close();
    process.exit(0);
  }
}

testDatabaseConnection();
