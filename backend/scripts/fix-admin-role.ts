// Fix admin role by directly updating in store
const http = require('http');

console.log('🔧 Fixing admin role...');

// First, let's create a script that updates the user role
const updateData = JSON.stringify({
  email: 'administrator@advancia.com',
  role: 'admin'
});

// We need to add an endpoint to update user role
const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify({
      email: 'masteradmin@advancia.com',
      password: 'Admin123456',
      firstName: 'Master',
      lastName: 'Admin'
    }))
  }
};

// Create a new admin with hardcoded role
const masterAdminData = JSON.stringify({
  email: 'masteradmin@advancia.com',
  password: 'Admin123456',
  firstName: 'Master',
  lastName: 'Admin'
});

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Master admin creation:', res.statusCode, data);
    
    if (res.statusCode === 201) {
      // Now manually set role in store by accessing the store directly
      console.log('\n⚠️  Note: The admin role needs to be set manually in the store');
      console.log('📧 Created user: masteradmin@advancia.com');
      console.log('🔑 Password: Admin123456');
      console.log('\n🔧 To fix admin role, restart the server with the create-admin script');
    }
  });
});

req.write(masterAdminData);
req.end();
