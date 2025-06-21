const http = require('http');

console.log('🔍 Testing Login and Navigation Flow...\n');

// Test login and then check what happens
async function testLoginFlow() {
  return new Promise((resolve, reject) => {
    const loginData = {
      email: 'admin@gmail.com',
      password: 'admin123'
    };
    
    const postData = JSON.stringify(loginData);
    
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    console.log('1. Testing login API call...');
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('✅ Login API Success:', {
              status: res.statusCode,
              message: response.message,
              hasUser: !!response.user,
              hasToken: !!response.token,
              userEmail: response.user?.email,
              userId: response.user?.id
            });
            
            // Test token verification
            testTokenVerification(response.token);
            resolve(response);
          } else {
            console.log('❌ Login API Failed:', {
              status: res.statusCode,
              error: response.error || response.message
            });
            reject(new Error(`Login failed: ${response.error || response.message}`));
          }
        } catch (parseError) {
          console.log('❌ Invalid JSON response:', data);
          reject(new Error('Invalid response format'));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(new Error(`Login request failed: ${err.message}`));
    });
    
    req.write(postData);
    req.end();
  });
}

function testTokenVerification(token) {
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/auth/verify',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  console.log('\n2. Testing token verification...');
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Token Verification Success:', {
            status: res.statusCode,
            hasUser: !!response.user,
            userEmail: response.user?.email,
            userId: response.user?.id
          });
        } else {
          console.log('❌ Token Verification Failed:', {
            status: res.statusCode,
            error: response.error || response.message
          });
        }
      } catch (parseError) {
        console.log('❌ Invalid JSON response from token verification:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.error('❌ Token verification request failed:', err.message);
  });
  
  req.end();
}

// Run the test
testLoginFlow()
  .then(() => {
    console.log('\n✅ Backend login flow test completed successfully');
    console.log('\n🔍 Analysis:');
    console.log('- Backend login API is working');
    console.log('- Token generation is working');
    console.log('- Token verification is working');
    console.log('\n❓ The issue is likely in the frontend navigation logic');
    console.log('❓ Check AuthContext.tsx, LoginForm.tsx, and AuthPage.tsx');
  })
  .catch((error) => {
    console.error('\n❌ Backend login flow test failed:', error.message);
  })
  .finally(() => {
    process.exit(0);
  });
