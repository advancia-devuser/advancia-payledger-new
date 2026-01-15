import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Advancia Pay Ledger database...\n');

  try {
    // ============================================
    // 1. CREATE ADMIN ACCOUNTS
    // ============================================

    console.log('👤 Creating admin accounts...');

    const superAdmin = await prisma.user.upsert({
      where: { email: 'superadmin@advanciapayledger.com' },
      update: {},
      create: {
        email: 'superadmin@advanciapayledger.com',
        password: await bcrypt.hash('SuperAdmin123!', 10),
        firstName: 'Super',
        lastName: 'Admin',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log('   ✅ Super Admin:', superAdmin.email);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@advanciapayledger.com' },
      update: {},
      create: {
        email: 'admin@advanciapayledger.com',
        password: await bcrypt.hash('Admin123!', 10),
        firstName: 'Admin',
        lastName: 'User',
        name: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log('   ✅ Admin:', admin.email);

    // ============================================
    // 2. CREATE TEST USERS
    // ============================================

    console.log('\n👥 Creating test users...');

    const testUser = await prisma.user.upsert({
      where: { email: 'user@test.com' },
      update: {},
      create: {
        email: 'user@test.com',
        password: await bcrypt.hash('TestUser123!', 10),
        firstName: 'Test',
        lastName: 'User',
        name: 'Test User',
        role: 'USER',
        status: 'ACTIVE',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log('   ✅ Active User:', testUser.email);

    const pendingUser = await prisma.user.upsert({
      where: { email: 'pending@test.com' },
      update: {},
      create: {
        email: 'pending@test.com',
        password: await bcrypt.hash('Pending123!', 10),
        firstName: 'Pending',
        lastName: 'User',
        name: 'Pending User',
        role: 'USER',
        status: 'PENDING_APPROVAL',
        isActive: false,
        emailVerified: false,
      },
    });
    console.log('   ✅ Pending User:', pendingUser.email);

    // ============================================
    // 3. CREATE MEDBED CHAMBERS
    // ============================================

    console.log('\n🏥 Creating MedBed Chambers...');

    const chambers = [
      {
        name: 'Holographic Medical Pod',
        description: 'Advanced holographic healing technology for cellular regeneration and pain relief.',
        price: 150,
        features: ['Holographic Imaging', 'Pain Relief', 'Cellular Repair', '30-60 min sessions'],
        imageUrl: '/images/chambers/holographic-pod.jpg',
      },
      {
        name: '90.10 MedBed',
        description: 'Full body regeneration system with advanced quantum healing capabilities.',
        price: 500,
        features: ['Full Body Scan', 'Quantum Healing', 'Age Reversal', 'Disease Treatment'],
        imageUrl: '/images/chambers/90-10-medbed.jpg',
      },
      {
        name: 'Celestial Chamber',
        description: 'Energy healing chamber using sacred geometry and frequency therapy.',
        price: 300,
        features: ['Energy Alignment', 'Frequency Healing', 'Chakra Balancing', 'Light Therapy'],
        imageUrl: '/images/chambers/celestial-chamber.jpg',
      },
      {
        name: 'Tesla BioHealing Chamber',
        description: 'Electromagnetic therapy chamber based on Tesla technology.',
        price: 400,
        features: ['EMF Therapy', 'Bio-Energy Enhancement', 'Cellular Optimization', 'Immune Boost'],
        imageUrl: '/images/chambers/tesla-biohealing.jpg',
      },
      {
        name: 'Quantum Healing Pod',
        description: 'State-of-the-art quantum frequency healing for deep cellular restoration.',
        price: 600,
        features: ['Quantum Frequencies', 'DNA Repair', 'Deep Healing', 'Consciousness Enhancement'],
        imageUrl: '/images/chambers/quantum-pod.jpg',
      },
      {
        name: 'Tesla Plasma Chamber',
        description: 'Advanced plasma therapy chamber for comprehensive healing and regeneration.',
        price: 1200,
        features: ['Plasma Technology', 'Advanced Regeneration', 'Disease Elimination', 'Life Extension'],
        imageUrl: '/images/chambers/tesla-plasma.jpg',
      },
    ];

    for (const chamber of chambers) {
      const created = await prisma.medBedChamber.upsert({
        where: { name: chamber.name },
        update: {},
        create: chamber,
      });
      console.log(`   ✅ ${created.name} - $${created.price}`);
    }

    // ============================================
    // 4. CREATE WALLETS FOR TEST USERS
    // ============================================

    console.log('\n💰 Creating wallets...');

    // Create wallet for super admin
    const superAdminWallet = await prisma.wallet.upsert({
      where: { userId: superAdmin.id },
      update: {},
      create: {
        userId: superAdmin.id,
        balance: 10000,
        cryptoAddress: '0x1234567890abcdef1234567890abcdef12345678',
      },
    });
    console.log(`   ✅ Super Admin wallet: $${superAdminWallet.balance}`);

    // Create wallet for test user
    const testUserWallet = await prisma.wallet.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        balance: 1000,
        cryptoAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
    });
    console.log(`   ✅ Test User wallet: $${testUserWallet.balance}`);

    // ============================================
    // 5. CREATE SAMPLE NOTIFICATIONS
    // ============================================

    console.log('\n🔔 Creating sample notifications...');

    await prisma.notification.create({
      data: {
        userId: testUser.id,
        type: 'security_alert',
        title: 'Welcome to Advancia Pay Ledger',
        message: 'Your account has been successfully created. Please complete your profile.',
        read: false,
      },
    });
    console.log('   ✅ Welcome notification created');

    // ============================================
    // SUMMARY
    // ============================================

    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDING COMPLETE!');
    console.log('='.repeat(60));

    console.log('\n📋 TEST CREDENTIALS:\n');
    console.log('Super Admin (Full Access):');
    console.log('  Email: superadmin@advanciapayledger.com');
    console.log('  Password: SuperAdmin123!');
    console.log('  Role: SUPER_ADMIN');
    console.log('  Can: Approve withdrawals, manage users, access all features\n');

    console.log('Admin (Limited Admin Access):');
    console.log('  Email: admin@advanciapayledger.com');
    console.log('  Password: Admin123!');
    console.log('  Role: ADMIN');
    console.log('  Can: Approve users, view reports, manage users');
    console.log('  Cannot: Approve withdrawals, delete users\n');

    console.log('Active Test User:');
    console.log('  Email: user@test.com');
    console.log('  Password: TestUser123!');
    console.log('  Role: USER');
    console.log('  Status: ACTIVE\n');

    console.log('Pending User (Awaiting Approval):');
    console.log('  Email: pending@test.com');
    console.log('  Password: Pending123!');
    console.log('  Role: USER');
    console.log('  Status: PENDING_APPROVAL\n');

    console.log('MedBed Chambers: 6 chambers created');
    console.log('  - Holographic Medical Pod ($150)');
    console.log('  - 90.10 MedBed ($500)');
    console.log('  - Celestial Chamber ($300)');
    console.log('  - Tesla BioHealing Chamber ($400)');
    console.log('  - Quantum Healing Pod ($600)');
    console.log('  - Tesla Plasma Chamber ($1200)\n');

    console.log('Wallets: 2 wallets created with test balances\n');

    console.log('='.repeat(60));
    console.log('✅ Ready to launch! Start backend with: npm run dev');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
