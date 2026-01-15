const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function debugAuth() {
  try {
    console.log("🔍 Debugging authentication...");

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: "admin@advanciapayledger.com" },
    });

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log("✅ User found:", {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    });

    // Test password verification
    const isValidPassword = await bcrypt.compare(
      "SuperAdmin123!",
      user.password
    );
    console.log("✅ Password valid:", isValidPassword);

    // Check if user has wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    console.log("✅ Wallet exists:", !!wallet);
    if (wallet) {
      console.log("💰 Wallet balance:", wallet.balance);
    }

    // Check transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      take: 3,
    });

    console.log("✅ Transactions count:", transactions.length);
  } catch (error) {
    console.error("❌ Debug error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuth();
