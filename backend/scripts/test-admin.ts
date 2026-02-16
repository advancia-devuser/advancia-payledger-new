import { store } from '../src/store';

// Test admin functionality
async function testAdmin() {
  console.log('🔍 Testing admin functionality...\n');
  
  // Check admin user
  const admin = store.findUserByEmail('admin@advancia.com');
  console.log('📧 Admin user found:', admin?.email);
  console.log('🔑 Admin role:', admin?.role);
  console.log('🆔 Admin ID:', admin?.id);
  
  // Get all users
  const allUsers = store.getAllUsers();
  console.log('\n👥 All users in system:');
  allUsers.forEach(user => {
    console.log(`  - ${user.email} (${user.role}) - Login count: ${user.loginCount}`);
  });
  
  // Get user stats
  const stats = store.getUserStats();
  console.log('\n📊 User Statistics:');
  console.log(`  Total users: ${stats.total}`);
  console.log(`  Admins: ${stats.admins}`);
  console.log(`  Regular users: ${stats.regularUsers}`);
  console.log(`  Total logins: ${stats.totalLogins}`);
  console.log(`  Recent logins (24h): ${stats.recentLogins}`);
}

testAdmin().catch(console.error);
