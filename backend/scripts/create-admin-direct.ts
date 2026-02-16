// Direct admin creation in the running server
const http = require('http');

const adminData = {
  email: 'admin@advancia.com',
  password: 'Admin123456',
  firstName: 'Super',
  lastName: 'Admin',
  role: 'admin'
};

// Create admin via registration
const postData = JSON.stringify(adminData);

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    if (res.statusCode === 201) {
      const response = JSON.parse(data);
      console.log('\n✅ Admin created successfully!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      console.log('🔑 Token:', response.token);
      
      // Test admin login
      testAdminLogin(response.token);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();

function testAdminLogin(token) {
  const loginData = JSON.stringify({
    email: adminData.email,
    password: adminData.password
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n🔑 Login Response:', data);
      
      const loginResponse = JSON.parse(data);
      if (loginResponse.token) {
        console.log('\n🎯 Testing admin access...');
        testAdminAccess(loginResponse.token);
      }
    });
  });

  loginReq.write(loginData);
  loginReq.end();
}

function testAdminAccess(token) {
  const adminOptions = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/admin/users',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const adminReq = http.request(adminOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('\n👑 Admin Access Test:');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      
      if (res.statusCode === 200) {
        console.log('\n✅ Admin panel working correctly!');
      } else {
        console.log('\n❌ Admin access failed');
      }
    });
  });

  adminReq.end();
}
