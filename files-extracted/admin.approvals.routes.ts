// ============================================================================
// ADMIN APPROVAL SYSTEM
// Only ADMIN and SUPER_ADMIN can approve/reject users
// ============================================================================

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';
import { sendEmail } from '../services/email.service';
import { createWallet } from '../services/wallet.service';

const router = Router();

/**
 * Get Pending User Registrations
 * GET /api/admin/approvals/pending
 */
router.get('/pending', authenticate, requireAdmin, async (req, res) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: 'PENDING_APPROVAL',
      },
      orderBy: {
        registeredAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        registeredAt: true,
        emailVerified: true,
      },
    });

    res.json({
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error: any) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      error: 'Failed to fetch pending users',
    });
  }
});

/**
 * Approve User
 * POST /api/admin/approvals/:userId/approve
 */
router.post('/:userId/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user!.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    if (user.status !== 'PENDING_APPROVAL') {
      return res.status(400).json({
        error: 'User is not pending approval',
        currentStatus: user.status,
      });
    }

    // Update user status to ACTIVE
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'ACTIVE',
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });

    // Create wallet for user
    try {
      await createWallet(userId, `${user.firstName} ${user.lastName}`);
    } catch (walletError) {
      console.error('Wallet creation error:', walletError);
      // Don't fail approval if wallet creation fails
    }

    // Send approval email to user
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
        message: 'Your account has been approved. You can now login and access all features.',
        link: '/dashboard',
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId,
        adminEmail: req.user!.email,
        action: 'APPROVE_USER',
        targetId: userId,
        targetType: 'user',
        details: {
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userRole: user.role,
          approvedAt: new Date(),
        },
        ipAddress: req.ip,
      },
    });

    res.json({
      message: 'User approved successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        status: updatedUser.status,
        approvedAt: updatedUser.approvedAt,
      },
    });
  } catch (error: any) {
    console.error('Approve user error:', error);
    res.status(500).json({
      error: 'Failed to approve user',
    });
  }
});

/**
 * Reject User
 * POST /api/admin/approvals/:userId/reject
 */
router.post('/:userId/reject', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;

    if (!reason) {
      return res.status(400).json({
        error: 'Rejection reason is required',
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    if (user.status !== 'PENDING_APPROVAL') {
      return res.status(400).json({
        error: 'User is not pending approval',
        currentStatus: user.status,
      });
    }

    // Update user status to REJECTED
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: 'REJECTED',
        rejectedBy: adminId,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });

    // Send rejection email to user
    await sendEmail({
      to: user.email,
      template: 'account-rejected',
      data: {
        firstName: user.firstName,
        reason,
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId,
        adminEmail: req.user!.email,
        action: 'REJECT_USER',
        targetId: userId,
        targetType: 'user',
        details: {
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          reason,
          rejectedAt: new Date(),
        },
        ipAddress: req.ip,
      },
    });

    res.json({
      message: 'User rejected',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        status: updatedUser.status,
        rejectedAt: updatedUser.rejectedAt,
        rejectionReason: updatedUser.rejectionReason,
      },
    });
  } catch (error: any) {
    console.error('Reject user error:', error);
    res.status(500).json({
      error: 'Failed to reject user',
    });
  }
});

/**
 * Get All Users (with status filter)
 * GET /api/admin/users
 */
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, role, limit = '50', page = '1' } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (role) where.role = role;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          emailVerified: true,
          kycStatus: true,
          registeredAt: true,
          approvedAt: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
    });
  }
});

export default router;
