// Quick backend connectivity test
const http = require('http');

console.log('🔍 Testing backend connectivity...');

function testBackendHealth() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8000/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('✅ Backend Health Check Response:');
                    console.log('  Status Code:', res.statusCode);
                    console.log('  Response:', response);
                    resolve(true);
                } catch (e) {
                    console.log('✅ Backend responded but with non-JSON:', data);
                    resolve(true);
                }
            });
        });
        
        req.on('error', (err) => {
            console.log('❌ Backend connection failed:', err.message);
            reject(err);
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            console.log('❌ Backend connection timeout');
            reject(new Error('Connection timeout'));
        });
    });
}

function testCORS() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ test: 'cors' });
        
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: '/health',
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        };
        
        const req = http.request(options, (res) => {
            console.log('✅ CORS Preflight Response:');
            console.log('  Status Code:', res.statusCode);
            console.log('  Headers:', res.headers);
            resolve(true);
        });
        
        req.on('error', (err) => {
            console.log('❌ CORS test failed:', err.message);
            reject(err);
        });
        
        req.end();
    });
}

async function runTests() {
    try {
        console.log('1. Testing basic backend health...');
        await testBackendHealth();
        
        console.log('\n2. Testing CORS configuration...');
        await testCORS();
        
        console.log('\n🎉 Backend connectivity tests completed!');
        
    } catch (error) {
        console.log('\n💡 Troubleshooting steps:');
        console.log('  1. Make sure backend is running: cd backend && npm run dev');
        console.log('  2. Check if port 8000 is accessible');
        console.log('  3. Verify CORS configuration in backend');
    }
}

runTests();
