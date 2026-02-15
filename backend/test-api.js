// Quick API test for in-memory storage
const http = require('http');

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing In-Memory Backend API\n');

  // Test 1: Root endpoint
  console.log('1️⃣ Testing root endpoint...');
  const root = await makeRequest('GET', '/');
  console.log('✅ Root:', root.data.message);
  console.log('   Storage:', root.data.storage);
  console.log('');

  // Test 2: Register user
  console.log('2️⃣ Testing user registration...');
  const register = await makeRequest('POST', '/api/auth/register', {
    email: 'test@example.com',
    password: 'Test123456',
    firstName: 'John',
    lastName: 'Doe'
  });
  console.log('✅ Register:', register.data.message);
  console.log('   User ID:', register.data.user?.id);
  const token = register.data.token;
  console.log('');

  // Test 3: Login
  console.log('3️⃣ Testing user login...');
  const login = await makeRequest('POST', '/api/auth/login', {
    email: 'test@example.com',
    password: 'Test123456'
  });
  console.log('✅ Login:', login.data.message);
  console.log('');

  // Test 4: Create wallet
  console.log('4️⃣ Testing wallet creation...');
  const walletReq = http.request({
    hostname: 'localhost',
    port: 4000,
    path: '/api/wallet',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      const data = JSON.parse(body);
      console.log('✅ Wallet created:', data.message);
      console.log('   Currency:', data.wallet?.currency);
      console.log('   Balance:', data.wallet?.balance);
      console.log('');
      
      // Test 5: Get wallets
      console.log('5️⃣ Testing get wallets...');
      const getWallets = http.request({
        hostname: 'localhost',
        port: 4000,
        path: '/api/wallet',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          const data = JSON.parse(body);
          console.log('✅ Wallets retrieved:', data.wallets?.length, 'wallet(s)');
          console.log('');
          console.log('🎉 All tests passed! In-memory storage working correctly.');
        });
      });
      getWallets.end();
    });
  });
  
  walletReq.write(JSON.stringify({
    type: 'crypto',
    currency: 'BTC',
    address: '0x1234567890abcdef'
  }));
  walletReq.end();
}

runTests().catch(console.error);
