import { store } from '../src/store';

// Create admin with direct role assignment
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const hashedPassword = await bcrypt.hash('Admin123456', 12);
  
  const admin = store.createUser({
    email: 'admin@advancia.com',
    password: hashedPassword,
    firstName: 'Super',
    lastName: 'Admin',
    kycVerified: true,
    twoFactorEnabled: true,
    role: 'admin',
    loginCount: 0
  });

  console.log('✅ Admin user created with admin role');
  console.log('📧 Email: admin@advancia.com');
  console.log('🔑 Password: Admin123456');
  console.log('🔑 Role:', admin.role);
  console.log('🆔 User ID:', admin.id);
}

createAdminUser().catch(console.error);
