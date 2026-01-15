import { PrismaClient } from '@prisma/client';
import { Response, Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ========================================
// INTERNAL ROUTES - NOT IN PUBLIC API DOCS
// ========================================
// These routes are for super admin emergency operations only
// DO NOT expose in public documentation or API reference
// All actions are logged for audit trail

/**
 * Middleware: Require SUPER_ADMIN role
 */
const requireSuperAdmin = async (req: AuthRequest, res: Response, next: any) => {
  try {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Forbidden: Super Admin access required'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

/**
 * SUPER ADMIN SECRET: Manual balance adjustment
 * Used for: Emergency corrections, testing, manual deposits
 * Security: Only super admin, logged in audit trail
 * Route: POST /internal/admin/balance/adjust
 * NOT EXPOSED IN PUBLIC DOCUMENTATION
 */
router.post('/balance/adjust', authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, amount, reason, currency = 'USD' } = req.body;

    if (!userId || !amount || !reason) {
      return res.status(400).json({
        error: 'userId, amount, and reason are required'
      });
    }

    // Find wallet
    const wallet = await prisma.wallet.findFirst({
      where: { userId, cryptoAddress: null },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Store previous balance for audit
    const previousBalance = wallet.balance;

    // Atomic update
    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amount },
      },
    });

    // CRITICAL: Log this action (secret audit trail)
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'BALANCE_ADJUSTMENT',
        resource: 'WALLET',
        resourceId: wallet.id,
        metadata: {
          targetUserId: userId,
          amount: amount.toString(),
          reason,
          currency,
          previousBalance: previousBalance.toString(),
          newBalance: updated.balance.toString(),
          adjustedBy: req.user!.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Create transaction record for transparency
    await prisma.transaction.create({
      data: {
        userId: userId,
        walletId: wallet.id,
        type: amount > 0 ? 'DEPOSIT' : 'WITHDRAWAL',
        amount: Math.abs(amount),
        currency: currency,
        status: 'COMPLETED',
        method: 'STRIPE_CARD', // Placeholder method
        metadata: {
          type: 'ADMIN_ADJUSTMENT',
          reason: reason,
          adjustedBy: req.user!.userId,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.json({
      success: true,
      wallet: {
        id: updated.id,
        userId: updated.userId,
        previousBalance: previousBalance.toString(),
        newBalance: updated.balance.toString(),
        adjustment: amount,
      },
      message: 'Balance adjusted successfully',
    });
  } catch (error: any) {
    console.error('Balance adjustment error:', error);
    res.status(500).json({
      error: 'Internal error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * SUPER ADMIN SECRET: Force withdrawal approval (emergency)
 * Used for: Emergency withdrawals, stuck transactions
 * Security: Requires super admin + reason
 * Route: POST /internal/admin/withdrawal/force
 * NOT EXPOSED IN PUBLIC DOCUMENTATION
 */
router.post('/withdrawal/force', authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { withdrawalId, reason, action = 'APPROVE' } = req.body;

    if (!withdrawalId || !reason) {
      return res.status(400).json({
        error: 'withdrawalId and reason are required'
      });
    }

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({
        error: 'action must be either APPROVE or REJECT'
      });
    }

    // Find withdrawal
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { user: true },
    });

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'PENDING') {
      return res.status(400).json({
        error: `Withdrawal is already ${withdrawal.status}`
      });
    }

    let updated;
    if (action === 'APPROVE') {
      // Mark as approved (bypasses normal approval flow)
      updated = await prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: {
          status: 'APPROVED',
          reviewedBy: req.user!.userId,
          reviewedAt: new Date(),
          notes: `[FORCE APPROVED BY SUPER ADMIN] ${reason}`,
        },
      });
    } else {
      // Reject and unlock balance
      updated = await prisma.$transaction(async (tx: any) => {
        // Update withdrawal status
        const rejected = await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: 'REJECTED',
            reviewedBy: req.user!.userId,
            reviewedAt: new Date(),
            rejectionReason: `[FORCE REJECTED BY SUPER ADMIN] ${reason}`,
          },
        });

        // Refund balance
        const wallet = await tx.wallet.findFirst({
          where: { userId: withdrawal.userId },
        });

        if (wallet) {
          await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              balance: { increment: withdrawal.amount },
            },
          });
        }

        return rejected;
      });
    }

    // CRITICAL: Secret audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: `FORCE_WITHDRAWAL_${action}`,
        resource: 'WITHDRAWAL',
        resourceId: withdrawalId,
        metadata: {
          targetUserId: withdrawal.userId,
          amount: withdrawal.amount.toString(),
          currency: withdrawal.currency,
          reason,
          action: action,
          forced: true,
          processedBy: req.user!.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.json({
      success: true,
      withdrawal: updated,
      message: `Withdrawal ${action.toLowerCase()}d successfully`
    });
  } catch (error: any) {
    console.error('Force withdrawal error:', error);
    res.status(500).json({
      error: 'Internal error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * SUPER ADMIN SECRET: View hidden audit trail
 * Shows all internal admin actions
 * Route: GET /internal/admin/audit/secret
 * NOT EXPOSED IN PUBLIC DOCUMENTATION
 */
router.get('/audit/secret', authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 100, action, userId } = req.query;

    const where: any = {
      action: {
        in: ['BALANCE_ADJUSTMENT', 'FORCE_WITHDRAWAL_APPROVE', 'FORCE_WITHDRAWAL_REJECT'],
      },
    };

    if (action) {
      where.action = action;
    }

    if (userId) {
      where.userId = userId;
    }

    const secretActions = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    // Get count
    const totalCount = await prisma.auditLog.count({ where });

    res.json({
      actions: secretActions,
      count: secretActions.length,
      total: totalCount,
      message: 'Secret audit trail retrieved'
    });
  } catch (error: any) {
    console.error('Secret audit retrieval error:', error);
    res.status(500).json({
      error: 'Internal error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * SUPER ADMIN SECRET: Force transaction status update
 * Used for: Stuck transactions, manual overrides
 * Route: POST /internal/admin/transaction/force-status
 * NOT EXPOSED IN PUBLIC DOCUMENTATION
 */
router.post('/transaction/force-status', authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { transactionId, status, reason } = req.body;

    if (!transactionId || !status || !reason) {
      return res.status(400).json({
        error: 'transactionId, status, and reason are required'
      });
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update status
    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: status as any,
        metadata: {
          ...(transaction.metadata as any || {}),
          forceStatusUpdate: {
            previousStatus: transaction.status,
            newStatus: status,
            reason: reason,
            updatedBy: req.user!.userId,
            timestamp: new Date().toISOString(),
          },
        },
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'FORCE_TRANSACTION_STATUS',
        resource: 'TRANSACTION',
        resourceId: transactionId,
        metadata: {
          transactionId,
          previousStatus: transaction.status,
          newStatus: status,
          reason,
          updatedBy: req.user!.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.json({
      success: true,
      transaction: updated,
      message: 'Transaction status updated successfully',
    });
  } catch (error: any) {
    console.error('Force transaction status error:', error);
    res.status(500).json({
      error: 'Internal error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * SUPER ADMIN SECRET: Emergency user unlock
 * Used for: Unlocking suspended/banned accounts in emergencies
 * Route: POST /internal/admin/user/emergency-unlock
 * NOT EXPOSED IN PUBLIC DOCUMENTATION
 */
router.post('/user/emergency-unlock', authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, reason } = req.body;

    if (!userId || !reason) {
      return res.status(400).json({
        error: 'userId and reason are required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousStatus = user.status;

    // Unlock user
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
        isActive: true,
      },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: 'EMERGENCY_USER_UNLOCK',
        resource: 'USER',
        resourceId: userId,
        metadata: {
          targetUserId: userId,
          previousStatus,
          newStatus: 'ACTIVE',
          reason,
          unlockedBy: req.user!.email,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        previousStatus,
        currentStatus: updated.status,
      },
      message: 'User unlocked successfully',
    });
  } catch (error: any) {
    console.error('Emergency user unlock error:', error);
    res.status(500).json({
      error: 'Internal error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * SUPER ADMIN SECRET: System health check with sensitive info
 * Route: GET /internal/admin/system/health
 * NOT EXPOSED IN PUBLIC DOCUMENTATION
 */
router.get('/system/health', authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Database connection check
    const dbCheck = await prisma.$queryRaw`SELECT 1 as result`;

    // Get critical counts
    const [
      pendingWithdrawals,
      activeUsers,
      totalTransactions,
      failedTransactions,
      pendingUsers,
    ] = await Promise.all([
      prisma.withdrawal.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { status: 'FAILED' } }),
      prisma.user.count({ where: { status: 'PENDING_APPROVAL' } }),
    ]);

    // Get recent admin actions
    const recentAdminActions = await prisma.auditLog.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
        action: {
          in: ['BALANCE_ADJUSTMENT', 'FORCE_WITHDRAWAL_APPROVE', 'FORCE_WITHDRAWAL_REJECT'],
        },
      },
    });

    res.json({
      status: 'operational',
      database: dbCheck ? 'connected' : 'disconnected',
      counts: {
        pendingWithdrawals,
        activeUsers,
        totalTransactions,
        failedTransactions,
        pendingUsers,
      },
      adminActivity: {
        last24Hours: recentAdminActions,
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error: any) {
    console.error('System health check error:', error);
    res.status(500).json({
      error: 'Health check failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
