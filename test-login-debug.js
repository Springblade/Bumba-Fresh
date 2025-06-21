const { LoginManager } = require('./database/src');

async function testLogin() {
  try {
    console.log('🔍 Testing login functionality...');
    
    const testEmail = 'admin@gmail.com';
    const testPassword = 'admin123';
    
    // Test getUserWithPassword
    console.log('\n1. Testing getUserWithPassword...');
    const user = await LoginManager.getUserWithPassword(testEmail);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('- User ID:', user.user_id);
      console.log('- Email:', user.email);
      console.log('- Password hash length:', user.password ? user.password.length : 'No password');
      console.log('- Password hash starts with:', user.password ? user.password.substring(0, 10) + '...' : 'N/A');
      
      // Test password verification
      console.log('\n2. Testing password verification...');
      const isValid = await LoginManager.verifyPassword(testPassword, user.password);
      console.log('Password verification result:', isValid);
      
      // Test full login process
      console.log('\n3. Testing full login process...');
      const loginResult = await LoginManager.loginAccount(testEmail, testPassword);
      console.log('Login result:', loginResult);
    } else {
      console.log('❌ No user found with email:', testEmail);
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testLogin();
