// ============================================================================
// AUTO-APPROVAL CRON JOB
// Runs every hour, approves users pending for 24+ hours
// ============================================================================

import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { sendEmail } from './email.service';
import { createWallet } from './wallet.service';

/**
 * Auto-approve users waiting 24+ hours
 * Runs every hour
 */
export function startAutoApprovalCron() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[AUTO-APPROVE] Starting auto-approval check...');

      // Find users pending for 24+ hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const pendingUsers = await prisma.user.findMany({
        where: {
          status: 'PENDING_APPROVAL',
          registeredAt: {
            lte: twentyFourHoursAgo,
          },
          autoApproved: false,
        },
      });

      console.log(`[AUTO-APPROVE] Found ${pendingUsers.length} users pending 24+ hours`);

      for (const user of pendingUsers) {
        try {
          // Update user to ACTIVE with auto-approve flag
          await prisma.user.update({
            where: { id: user.id },
            data: {
              status: 'ACTIVE',
              autoApproved: true,
              approvedBy: 'SYSTEM_AUTO',
              approvedAt: new Date(),
            },
          });

          // Create wallet
          try {
            await createWallet(user.id, `${user.firstName} ${user.lastName}`);
          } catch (walletError) {
            console.error(`[AUTO-APPROVE] Wallet creation failed for ${user.email}:`, walletError);
          }

          // Send approval email
          await sendEmail({
            to: user.email,
            template: 'account-approved',
            data: {
              firstName: user.firstName,
              loginUrl: `${process.env.FRONTEND_URL}/login`,
            },
          });

          // Create notification
          await prisma.notification.create({
            data: {
              userId: user.id,
              type: 'APPROVAL',
              title: '🎉 Account Approved!',
              message: 'Your account has been automatically approved. You can now login and access all features.',
              link: '/dashboard',
            },
          });

          // Log system action
          await prisma.adminAction.create({
            data: {
              adminId: 'SYSTEM',
              adminEmail: 'system@advancia.com',
              action: 'APPROVE_USER',
              targetId: user.id,
              targetType: 'user',
              details: {
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email,
                autoApproved: true,
                reason: 'Auto-approved after 24 hours',
                approvedAt: new Date(),
              },
            },
          });

          console.log(`[AUTO-APPROVE] ✅ Auto-approved: ${user.email}`);
        } catch (error) {
          console.error(`[AUTO-APPROVE] Failed to approve ${user.email}:`, error);
        }
      }

      console.log('[AUTO-APPROVE] Auto-approval check complete');
    } catch (error) {
      console.error('[AUTO-APPROVE] Cron job error:', error);
    }
  });

  console.log('[AUTO-APPROVE] Cron job started (runs every hour)');
}

/**
 * Manual trigger for testing
 */
export async function runAutoApprovalNow() {
  console.log('[AUTO-APPROVE] Manual trigger started...');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const pendingUsers = await prisma.user.findMany({
    where: {
      status: 'PENDING_APPROVAL',
      registeredAt: {
        lte: twentyFourHoursAgo,
      },
      autoApproved: false,
    },
  });

  console.log(`[AUTO-APPROVE] Found ${pendingUsers.length} users to auto-approve`);

  for (const user of pendingUsers) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: 'ACTIVE',
          autoApproved: true,
          approvedBy: 'SYSTEM_AUTO',
          approvedAt: new Date(),
        },
      });

      await createWallet(user.id, `${user.firstName} ${user.lastName}`);

      await sendEmail({
        to: user.email,
        template: 'account-approved',
        data: {
          firstName: user.firstName,
          loginUrl: `${process.env.FRONTEND_URL}/login`,
        },
      });

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'APPROVAL',
          title: '🎉 Account Approved!',
          message: 'Your account has been automatically approved.',
          link: '/dashboard',
        },
      });

      console.log(`[AUTO-APPROVE] ✅ ${user.email}`);
    } catch (error) {
      console.error(`[AUTO-APPROVE] ❌ ${user.email}:`, error);
    }
  }

  return {
    processed: pendingUsers.length,
    users: pendingUsers.map(u => u.email),
  };
}
