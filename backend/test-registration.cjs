const fetch = require('node-fetch');

async function testRegistrationOnly() {
  console.log('🧪 Testing registration with a unique email...\n');
  
  try {
    const newUser = {
      email: `testuser${Date.now()}@example.com`, // Unique email
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User'
    };
    
    console.log(`Registering: ${newUser.email}`);
    
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser)
    });
    
    const result = await response.text();
    
    if (response.ok) {
      const data = JSON.parse(result);
      console.log(`✅ Registration successful for ${newUser.email}`);
      console.log(`   Role: ${data.user.role} (should be 'user')`);
      console.log(`   User: ${data.user.firstName} ${data.user.lastName}`);
      console.log(`   Token: ${data.token.substring(0, 20)}...`);
    } else {
      console.log(`❌ Registration failed for ${newUser.email}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${result}`);
    }
    
  } catch (error) {
    console.log(`❌ Error testing registration: ${error.message}`);
  }
}

testRegistrationOnly();
