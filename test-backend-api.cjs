// Simple test script for backend API
const http = require('http');

console.log('🧪 Testing Backend API...\n');

// Test health endpoint
function testHealth() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8000/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Health Check:', JSON.parse(data));
                    resolve(true);
                } else {
                    reject(new Error(`Health check failed: ${res.statusCode}`));
                }
            });
        });
        
        req.on('error', (err) => {
            reject(new Error(`Connection failed: ${err.message}`));
        });
        
        req.setTimeout(5000, () => {
            req.abort();
            reject(new Error('Connection timeout'));
        });
    });
}

// Test registration endpoint
function testRegistration() {
    return new Promise((resolve, reject) => {
        const userData = {
            email: 'test' + Date.now() + '@example.com',
            password: 'TestPassword123',
            firstName: 'Test',
            lastName: 'User'
        };
        
        const postData = JSON.stringify(userData);
        
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (res.statusCode === 201) {
                        console.log('✅ Registration Test:', {
                            status: 'success',
                            email: response.user.email,
                            hasToken: !!response.token
                        });
                        resolve({ userData, response });
                    } else {
                        console.log('❌ Registration Failed:', {
                            status: res.statusCode,
                            error: response.error || response.message,
                            details: response.details
                        });
                        reject(new Error(`Registration failed: ${response.error || response.message}`));
                    }
                } catch (parseError) {
                    console.log('❌ Invalid JSON response:', data);
                    reject(new Error('Invalid response format'));
                }
            });
        });
        
        req.on('error', (err) => {
            reject(new Error(`Registration request failed: ${err.message}`));
        });
        
        req.write(postData);
        req.end();
    });
}

// Test login with admin account
function testAdminLogin() {
    return new Promise((resolve, reject) => {
        const loginData = {
            email: 'admin@gmail.com',
            password: 'password123'
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
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (res.statusCode === 200) {
                        console.log('✅ Admin Login Test:', {
                            status: 'success',
                            email: response.user.email,
                            hasToken: !!response.token
                        });
                        resolve(response);
                    } else {
                        console.log('❌ Admin Login Failed:', {
                            status: res.statusCode,
                            error: response.error || response.message,
                            details: response.details
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

// Run all tests
async function runTests() {
    try {
        console.log('1. Testing Backend Health...');
        await testHealth();
        
        console.log('\n2. Testing User Registration...');
        const { userData } = await testRegistration();
        
        console.log('\n3. Testing Admin Login...');
        await testAdminLogin();
        
        console.log('\n🎉 All tests passed! Your backend is working correctly.');
        console.log('\n📋 Next steps:');
        console.log('   1. Set up the database using: setup-database.bat');
        console.log('   2. Test frontend by starting: npm run dev');
        console.log('   3. Visit: http://localhost:5173');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure PostgreSQL is running');
        console.log('   2. Run setup-database.bat to create the database');
        console.log('   3. Check backend/.env configuration');
    }
}

runTests();
