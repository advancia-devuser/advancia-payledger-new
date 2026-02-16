// Direct test without imports
const bcrypt = require('bcryptjs');

// Simulate store
const users = new Map();
let idCounter = 1;

function generateId() {
  return (idCounter++).toString().padStart(24, "0");
}

function createUser(data) {
  const user = {
    ...data,
    id: generateId(),
    createdAt: new Date(),
  };
  users.set(user.id, user);
  return user;
}

function findUserByEmail(email) {
  return Array.from(users.values()).find(u => u.email === email);
}

function getAllUsers() {
  return Array.from(users.values());
}

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('Admin123456', 12);
  
  const admin = createUser({
    email: 'admin@advancia.com',
    password: hashedPassword,
    firstName: 'Super',
    lastName: 'Admin',
    kycVerified: true,
    twoFactorEnabled: true,
    role: 'admin',
    loginCount: 0
  });

  console.log('✅ Admin created:', admin.email, admin.role);
  
  // Create test users
  const testUsers = [
    { email: 'john@test.com', firstName: 'John', lastName: 'Doe' },
    { email: 'jane@test.com', firstName: 'Jane', lastName: 'Smith' }
  ];

  for (const userData of testUsers) {
    const testPassword = await bcrypt.hash('Test123456', 12);
    createUser({
      email: userData.email,
      password: testPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      kycVerified: false,
      twoFactorEnabled: false,
      role: 'user',
      loginCount: 0
    });
  }

  console.log('\n👥 All users:');
  getAllUsers().forEach(user => {
    console.log(`  - ${user.email} (${user.role})`);
  });
}

createAdmin().catch(console.error);
