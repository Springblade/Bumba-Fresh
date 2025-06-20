// Simple Node.js script to test backend startup and API endpoints
const http = require('http');

// Test backend connection
function testBackend() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8000/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Backend Health Check:', JSON.parse(data));
                    resolve(true);
                } else {
                    reject(new Error(`Backend returned status ${res.statusCode}`));
                }
            });
        });
        
        req.on('error', (err) => {
            reject(new Error(`Backend connection failed: ${err.message}`));
        });
        
        req.setTimeout(5000, () => {
            req.abort();
            reject(new Error('Backend connection timeout'));
        });
    });
}

// Test database connection through backend
function testDatabase() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8000/api/meals', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(data);
                    console.log('✅ Database Connection (via meals API):', {
                        mealsCount: response.meals ? response.meals.length : 0,
                        message: response.message
                    });
                    resolve(true);
                } else {
                    reject(new Error(`Database API returned status ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (err) => {
            reject(new Error(`Database API connection failed: ${err.message}`));
        });
        
        req.setTimeout(5000, () => {
            req.abort();
            reject(new Error('Database API connection timeout'));
        });
    });
}

// Test user registration
function testRegistration(userData) {
    return new Promise((resolve, reject) => {
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
                const response = JSON.parse(data);
                if (res.statusCode === 201) {
                    console.log('✅ Registration Success:', {
                        userId: response.user.id,
                        email: response.user.email,
                        hasToken: !!response.token
                    });
                    resolve(response);
                } else {
                    console.log('❌ Registration Failed:', response);
                    reject(new Error(`Registration failed: ${response.error || response.message}`));
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

// Test user login
function testLogin(credentials) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(credentials);
        
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
                const response = JSON.parse(data);
                if (res.statusCode === 200) {
                    console.log('✅ Login Success:', {
                        userId: response.user.id,
                        email: response.user.email,
                        hasToken: !!response.token
                    });
                    resolve(response);
                } else {
                    console.log('❌ Login Failed:', response);
                    reject(new Error(`Login failed: ${response.error || response.message}`));
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

// Main test function
async function runTests() {
    console.log('🧪 Starting API Tests...\n');
    
    try {
        // Test backend connection
        console.log('1. Testing Backend Connection...');
        await testBackend();
        
        console.log('\n2. Testing Database Connection...');
        await testDatabase();
        
        console.log('\n3. Testing User Registration...');
        const newUser = {
            email: 'test' + Date.now() + '@example.com',
            password: 'TestPassword123',
            firstName: 'Test',
            lastName: 'User'
        };
        const registrationResult = await testRegistration(newUser);
        
        console.log('\n4. Testing User Login...');
        const loginResult = await testLogin({
            email: newUser.email,
            password: newUser.password
        });
        
        console.log('\n5. Testing Login with Existing Account...');
        try {
            await testLogin({
                email: 'admin@gmail.com',
                password: 'password'
            });
        } catch (error) {
            console.log('ℹ️  Admin account login failed (expected if password is different):', error.message);
        }
        
        console.log('\n🎉 All API tests completed successfully!');
        console.log('\n📍 Your backend is working correctly');
        console.log('📍 Database is connected and functional');
        console.log('📍 Authentication endpoints are working');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Make sure PostgreSQL is running');
        console.log('   2. Check if backend server is started (node backend/src/index.js)');
        console.log('   3. Verify database connection settings in backend/.env');
    }
}

// Run tests
runTests();
