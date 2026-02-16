import { store } from '../src/store';

// Fix admin role by directly updating the user
const admin = store.findUserByEmail('admin@advancia.com');
if (admin) {
  const updated = store.updateUser(admin.id, { role: 'admin' });
  console.log('✅ Admin role updated successfully');
  console.log('📧 Email:', updated?.email);
  console.log('🔑 Role:', updated?.role);
  console.log('🆔 User ID:', updated?.id);
} else {
  console.log('❌ Admin user not found');
}
