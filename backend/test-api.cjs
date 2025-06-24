const fetch = require('node-fetch');

async function testLogin() {
  const testAccounts = [
    { email: 'admin@bumba.com', password: 'admin123', expectedRole: 'admin' },
    { email: 'dietitian@bumba.com', password: 'dietitian123', expectedRole: 'dietitian' },
    { email: 'user@bumba.com', password: 'user123', expectedRole: 'user' }
  ];
  
  console.log('🧪 Testing login API endpoints...\n');
  
  for (const account of testAccounts) {
    try {
      console.log(`Testing ${account.email}...`);
      
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password
        })
      });
      
      const result = await response.text();
      
      if (response.ok) {
        const data = JSON.parse(result);
        console.log(`✅ Login successful for ${account.email}`);
        console.log(`   Role: ${data.user.role} (expected: ${account.expectedRole})`);
        console.log(`   User: ${data.user.firstName} ${data.user.lastName}`);
        console.log(`   Token: ${data.token.substring(0, 20)}...`);
      } else {
        console.log(`❌ Login failed for ${account.email}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${result}`);
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${account.email}: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Test registration
  console.log('🧪 Testing registration API...\n');
  
  try {
    const newUser = {
      email: 'newuser@test.com',
      password: 'TestPass123!',
      firstName: 'New',
      lastName: 'User'
    };
    
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

testLogin();
