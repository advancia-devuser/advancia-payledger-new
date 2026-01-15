import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * Seed script for testing registration journey
 * Creates test users in various states
 */
async function seedRegistrationTest() {
  console.log("🌱 Seeding registration test data...");

  try {
    // Hash password for test users
    const hashedPassword = await bcrypt.hash("TestPass123!", 10);

    // 1. Create a pending approval user (just registered)
    const pendingUser = await prisma.user.upsert({
      where: { email: "pending@test.com" },
      update: {},
      create: {
        email: "pending@test.com",
        password: hashedPassword,
        firstName: "Pending",
        lastName: "User",
        phone: "+1 (555) 111-1111",
        status: "PENDING_APPROVAL",
        emailVerified: true,
        role: "USER",
        registeredAt: new Date(),
      },
    });
    console.log("✅ Created pending approval user:", pendingUser.email);

    // 2. Create an active user (approved)
    const activeUser = await prisma.user.upsert({
      where: { email: "active@test.com" },
      update: {},
      create: {
        email: "active@test.com",
        password: hashedPassword,
        firstName: "Active",
        lastName: "User",
        phone: "+1 (555) 222-2222",
        status: "ACTIVE",
        emailVerified: true,
        role: "USER",
        registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        approvedBy: "admin-test",
        autoApproved: false,
      },
    });
    console.log("✅ Created active user:", activeUser.email);

    // 3. Create an unverified email user
    const unverifiedUser = await prisma.user.upsert({
      where: { email: "unverified@test.com" },
      update: {},
      create: {
        email: "unverified@test.com",
        password: hashedPassword,
        firstName: "Unverified",
        lastName: "User",
        phone: "+1 (555) 333-3333",
        status: "PENDING_APPROVAL",
        emailVerified: false,
        emailVerificationToken: "test-verification-token-123",
        role: "USER",
        registeredAt: new Date(),
      },
    });
    console.log("✅ Created unverified email user:", unverifiedUser.email);

    // 4. Create an old pending user (for auto-approval testing)
    const oldPendingUser = await prisma.user.upsert({
      where: { email: "oldpending@test.com" },
      update: {},
      create: {
        email: "oldpending@test.com",
        password: hashedPassword,
        firstName: "Old Pending",
        lastName: "User",
        phone: "+1 (555) 444-4444",
        status: "PENDING_APPROVAL",
        emailVerified: true,
        role: "USER",
        registeredAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
      },
    });
    console.log("✅ Created old pending user (for auto-approval):", oldPendingUser.email);

    // 5. Create a rejected user
    const rejectedUser = await prisma.user.upsert({
      where: { email: "rejected@test.com" },
      update: {},
      create: {
        email: "rejected@test.com",
        password: hashedPassword,
        firstName: "Rejected",
        lastName: "User",
        phone: "+1 (555) 555-5555",
        status: "REJECTED",
        emailVerified: true,
        role: "USER",
        registeredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        rejectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        rejectedBy: "admin-test",
        rejectionReason: "Test rejection - incomplete information",
      },
    });
    console.log("✅ Created rejected user:", rejectedUser.email);

    // 6. Create an admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@test.com" },
      update: {},
      create: {
        email: "admin@test.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        phone: "+1 (555) 999-9999",
        status: "ACTIVE",
        emailVerified: true,
        role: "ADMIN",
        registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        approvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        approvedBy: "system",
      },
    });
    console.log("✅ Created admin user:", adminUser.email);

    console.log("\n📋 Test Users Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email                 | Status            | Email Verified | Password");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("pending@test.com      | PENDING_APPROVAL  | ✅             | TestPass123!");
    console.log("active@test.com       | ACTIVE            | ✅             | TestPass123!");
    console.log("unverified@test.com   | PENDING_APPROVAL  | ❌             | TestPass123!");
    console.log("oldpending@test.com   | PENDING_APPROVAL  | ✅             | TestPass123!");
    console.log("rejected@test.com     | REJECTED          | ✅             | TestPass123!");
    console.log("admin@test.com        | ACTIVE (ADMIN)    | ✅             | TestPass123!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n🧪 Testing Scenarios:");
    console.log("1. Login with active@test.com - Should succeed");
    console.log("2. Login with pending@test.com - Should fail (not active)");
    console.log("3. Login with unverified@test.com - Should fail (email not verified)");
    console.log("4. Verify email with token: test-verification-token-123");
    console.log("5. Run auto-approval cron - oldpending@test.com should be approved");
    console.log("6. Admin login with admin@test.com - Access admin panel");

    console.log("\n✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedRegistrationTest()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
