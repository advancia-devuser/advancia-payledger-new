import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create Super Admin
  const adminPassword = await bcrypt.hash("SuperAdmin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@advanciapayledger.com" },
    update: {
      password: adminPassword,
      status: "ACTIVE",
      role: "SUPER_ADMIN",
    },
    create: {
      email: "admin@advanciapayledger.com",
      password: adminPassword,
      name: "Super Admin",
      firstName: "Super",
      lastName: "Admin",
      status: "ACTIVE",
      role: "SUPER_ADMIN",
      emailVerified: true,
      kycStatus: "approved",
    },
  });

  console.log("✅ Super Admin created:", admin.email);

  // Create active test user
  const userPassword = await bcrypt.hash("TestUser123!", 12);
  const testUser = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {
      password: userPassword,
      status: "ACTIVE",
    },
    create: {
      email: "user@test.com",
      password: userPassword,
      name: "Test User",
      firstName: "Test",
      lastName: "User",
      status: "ACTIVE",
      role: "USER",
      emailVerified: true,
      kycStatus: "approved",
    },
  });

  console.log("✅ Test user created:", testUser.email);

  // Create pending user (for testing approval workflow)
  const pendingPassword = await bcrypt.hash("Pending123!", 12);
  const pendingUser = await prisma.user.upsert({
    where: { email: "pending@test.com" },
    update: {
      status: "PENDING_APPROVAL",
    },
    create: {
      email: "pending@test.com",
      password: pendingPassword,
      name: "Pending User",
      firstName: "Pending",
      lastName: "User",
      status: "PENDING_APPROVAL",
      role: "USER",
      emailVerified: false,
      kycStatus: "not_started",
    },
  });

  console.log("✅ Pending user created:", pendingUser.email);

  // Create wallets for users
  const adminWallet = await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {
      balance: 10000.0,
    },
    create: {
      userId: admin.id,
      balance: 10000.0,
      cryptoAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    },
  });

  const testUserWallet = await prisma.wallet.upsert({
    where: { userId: testUser.id },
    update: {
      balance: 1000.0,
    },
    create: {
      userId: testUser.id,
      balance: 1000.0,
      cryptoAddress: "0x1234567890123456789012345678901234567890",
    },
  });

  console.log("✅ Wallets created for users");

  // Create sample transactions
  const adminTransaction = await prisma.transaction.create({
    data: {
      userId: admin.id,
      walletId: adminWallet.id,
      type: "DEPOSIT",
      amount: 10000.0,
      currency: "USD",
      status: "COMPLETED",
      method: "STRIPE_CARD",
      metadata: { description: "Initial funding" },
    },
  });

  const testUserTransaction = await prisma.transaction.create({
    data: {
      userId: testUser.id,
      walletId: testUserWallet.id,
      type: "DEPOSIT",
      amount: 1000.0,
      currency: "USD",
      status: "COMPLETED",
      method: "STRIPE_CARD",
      metadata: { description: "Initial funding" },
    },
  });

  console.log("✅ Sample transactions created");

  // Create MedBed chambers
  const medBedChambers = await prisma.medBedChamber.createMany({
    data: [
      {
        name: "Quantum Healing Chamber",
        description:
          "Advanced quantum therapy for rapid recovery and cellular regeneration",
        price: 250.0,
        capacity: 1,
        features: [
          "Quantum Resonance",
          "DNA Repair",
          "Cellular Regeneration",
          "Pain Relief",
        ],
        isActive: true,
      },
      {
        name: "Regeneration Pod",
        description:
          "Stem cell therapy and tissue regeneration for advanced healing",
        price: 500.0,
        capacity: 1,
        features: [
          "Stem Cell Therapy",
          "Tissue Regeneration",
          "Anti-aging",
          "Immune Boost",
        ],
        isActive: true,
      },
      {
        name: "Neural Enhancement Chamber",
        description: "Cognitive enhancement and neural pathway optimization",
        price: 750.0,
        capacity: 1,
        features: [
          "Neural Stimulation",
          "Memory Enhancement",
          "Focus Improvement",
          "Brain Health",
        ],
        isActive: true,
      },
    ],
  });

  console.log("✅ MedBed chambers created");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Super Admin: ${admin.email} / SuperAdmin123!`);
  console.log(
    `   - Test User: ${testUser.email} / TestUser123! (status: active)`
  );
  console.log(
    `   - Pending User: ${pendingUser.email} / Pending123! (status: pending)`
  );
  console.log("\n🔑 Test Credentials:");
  console.log("   Admin Login: admin@advanciapayledger.com / SuperAdmin123!");
  console.log("   User Login: user@test.com / TestUser123!");
  console.log("   Pending (needs approval): pending@test.com / Pending123!");
  console.log("\n💰 Wallet Balances:");
  console.log(`   - Admin: $${adminWallet.balance}`);
  console.log(`   - Test User: $${testUserWallet.balance}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
