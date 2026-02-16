import { store } from '../src/store';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  // Check if admin already exists
  const existingAdmin = store.findUserByEmail('admin@advancia.com');
  if (existingAdmin) {
    // Update existing user to admin role
    store.updateUser(existingAdmin.id, { role: 'admin' });
    console.log('✅ Updated existing user to admin role');
    return;
  }

  // Create new admin user
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

  console.log('✅ Admin user created successfully');
  console.log('📧 Email: admin@advancia.com');
  console.log('🔑 Password: Admin123456');
  console.log('🆔 User ID:', admin.id);
}

createAdmin().catch(console.error);
