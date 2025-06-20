// Simple API test
const https = require('http');

console.log('Testing API endpoints...');

// Test health endpoint
const healthReq = https.request({
  hostname: 'localhost',
  port: 8000,
  path: '/health',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('✅ Health endpoint:', JSON.parse(data));
    testRegistration();
  });
});

healthReq.on('error', (error) => {
  console.error('❌ Health endpoint error:', error.message);
});

healthReq.end();

// Test registration endpoint
function testRegistration() {
  const postData = JSON.stringify({
    email: 'test@example.com',
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User'
  });

  const regReq = https.request({
    hostname: 'localhost',
    port: 8000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`📝 Registration status: ${res.statusCode}`);
      try {
        const result = JSON.parse(data);
        console.log('📝 Registration response:', result);
      } catch (e) {
        console.log('📝 Registration raw response:', data);
      }
      testLogin();
    });
  });

  regReq.on('error', (error) => {
    console.error('❌ Registration error:', error.message);
  });

  regReq.write(postData);
  regReq.end();
}

// Test login endpoint
function testLogin() {
  const postData = JSON.stringify({
    email: 'admin@gmail.com',
    password: 'admin123'
  });

  const loginReq = https.request({
    hostname: 'localhost',
    port: 8000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log(`🔐 Login status: ${res.statusCode}`);
      try {
        const result = JSON.parse(data);
        console.log('🔐 Login response:', result);
      } catch (e) {
        console.log('🔐 Login raw response:', data);
      }
      process.exit(0);
    });
  });

  loginReq.on('error', (error) => {
    console.error('❌ Login error:', error.message);
    process.exit(1);
  });

  loginReq.write(postData);
  loginReq.end();
}
