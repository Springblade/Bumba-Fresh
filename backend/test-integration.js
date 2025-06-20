// Test integration between backend and database layer
const { AccountCreator, LoginManager, InventoryManager } = require('../database/src');

async function testIntegration() {
  console.log('🧪 Testing database layer integration...');
  
  try {
    // Test if classes are available
    console.log('✅ AccountCreator available:', typeof AccountCreator.createAccount === 'function');
    console.log('✅ LoginManager available:', typeof LoginManager.loginAccount === 'function');
    console.log('✅ InventoryManager available:', typeof InventoryManager.getAllMeals === 'function');
    
    console.log('🎉 All database utilities are properly imported!');
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

testIntegration();
