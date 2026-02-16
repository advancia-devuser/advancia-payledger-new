import { store } from "../src/store";
import bcrypt from "bcryptjs";

// Clear all users and create admin
async function resetAndCreateAdmin() {
  // Get all users and clear them
  const allUsers = store.getAllUsers();
  console.log(`🗑️  Clearing ${allUsers.length} existing users...`);

  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin123456", 12);

  const admin = store.createUser({
    email: "admin@advancia.com",
    password: hashedPassword,
    firstName: "Super",
    lastName: "Admin",
    kycVerified: true,
    twoFactorEnabled: true,
    role: "admin",
    loginCount: 0,
  });

  console.log("✅ Admin user created successfully");
  console.log("📧 Email: admin@advancia.com");
  console.log("🔑 Password: Admin123456");
  console.log("🔑 Role:", admin.role);
  console.log("🆔 User ID:", admin.id);

  // Create some test users
  const testUsers = [
    { email: "john@test.com", firstName: "John", lastName: "Doe" },
    { email: "jane@test.com", firstName: "Jane", lastName: "Smith" },
    { email: "bob@test.com", firstName: "Bob", lastName: "Wilson" },
  ];

  for (const userData of testUsers) {
    const testPassword = await bcrypt.hash("Test123456", 12);
    store.createUser({
      email: userData.email,
      password: testPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      kycVerified: false,
      twoFactorEnabled: false,
      role: "user",
      loginCount: 0,
    });
    console.log(`👤 Created test user: ${userData.email}`);
  }

  console.log("\n🎉 Setup complete! You can now:");
  console.log("1. Login as admin: admin@advancia.com / Admin123456");
  console.log("2. Access admin panel at /api/admin endpoints");
  console.log("3. Test with regular users: john@test.com / Test123456");
}

resetAndCreateAdmin().catch(console.error);
