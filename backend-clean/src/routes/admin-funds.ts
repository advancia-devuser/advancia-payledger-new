import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import prisma from "../lib/prisma";
import emailService from "../services/emailService";

const router = Router();

// INTERNAL ROUTE - NOT EXPOSED IN PUBLIC API DOCUMENTATION
// Super Admin only - Fund management capabilities
// This route is part of platform internal rules and should remain confidential

/**
 * Send funds to user account
 * Super Admin only - Internal platform operation
 */
router.post(
  "/send-to-user",
  authenticate,
  requireRole("SUPERADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId, amount, currency, reason, notifyUser } = req.body;

      if (!userId || !amount || !currency) {
        res
          .status(400)
          .json({ error: "User ID, amount, and currency are required" });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({ error: "Amount must be positive" });
        return;
      }

      // Get user with wallet
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { wallet: true },
      });

      if (!targetUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Update user balance based on currency
      const updateData: any = {};
      if (currency === "USD") {
        updateData.wallet = {
          update: {
            balance: { increment: amount },
          },
        };
      } else if (currency === "CRYPTO") {
        updateData.wallet = {
          update: {
            balance: { increment: amount },
          },
        };
      } else {
        res.status(400).json({ error: "Invalid currency type" });
        return;
      }

      // Update balance
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: { wallet: true },
      });

      // Log activity
      await prisma.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: "ADMIN_FUND_TRANSFER",
          resource: "user",
          resourceId: userId,
          metadata: JSON.stringify({
            targetUserId: userId,
            amount,
            currency,
            reason: reason || "Admin fund transfer",
            timestamp: new Date().toISOString(),
          }),
          ipAddress: req.ip || "unknown",
          userAgent: req.headers["user-agent"] || "unknown",
        },
      });

      // Send email notification if requested
      if (notifyUser && targetUser.email) {
        await emailService.sendEmail({
          to: targetUser.email,
          subject: "Funds Added to Your Account",
          html: `
            <h2>Account Credit Notification</h2>
            <p>Good news! Your Advancia Pay account has been credited.</p>
            <p><strong>Amount:</strong> ${amount} ${currency}</p>
            <p><strong>New Balance:</strong> ${Number(
              updatedUser.wallet?.balance || 0
            )} ${currency}</p>
            <p>If you have any questions, please contact support.</p>
          `,
        });
      }

      res.json({
        success: true,
        message: "Funds sent successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          balance: Number(updatedUser.wallet?.balance || 0),
        },
      });
    } catch (error: any) {
      console.error("Admin fund transfer error:", error);
      res.status(500).json({ error: "Fund transfer failed" });
    }
  }
);

/**
 * Withdraw funds from user account
 * Super Admin only - Internal platform operation
 */
router.post(
  "/withdraw-from-user",
  authenticate,
  requireRole("SUPERADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId, amount, currency, reason, notifyUser } = req.body;

      if (!userId || !amount || !currency) {
        res
          .status(400)
          .json({ error: "User ID, amount, and currency are required" });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({ error: "Amount must be positive" });
        return;
      }

      // Get user with wallet
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { wallet: true },
      });

      if (!targetUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Check sufficient balance
      const currentBalance = Number(targetUser.wallet?.balance || 0);

      if (currentBalance < amount) {
        res.status(400).json({
          error: "Insufficient balance",
          currentBalance,
          requestedAmount: amount,
        });
        return;
      }

      // Update user balance for withdrawal
      const updateData: any = {};
      updateData.wallet = {
        update: {
          balance: { decrement: amount },
        },
      };

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: { wallet: true },
      });

      // Log activity
      await prisma.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: "ADMIN_FUND_WITHDRAWAL",
          resource: "user",
          resourceId: userId,
          metadata: JSON.stringify({
            targetUserId: userId,
            amount,
            currency,
            reason: reason || "Admin fund withdrawal",
            timestamp: new Date().toISOString(),
          }),
          ipAddress: req.ip || "unknown",
          userAgent: req.headers["user-agent"] || "unknown",
        },
      });

      // Send email notification if requested
      if (notifyUser && targetUser.email) {
        await emailService.sendEmail({
          to: targetUser.email,
          subject: "Account Debit Notification",
          html: `
            <h2>Account Debit Notification</h2>
            <p>Your Advancia Pay account has been debited.</p>
            <p><strong>Amount:</strong> ${amount} ${currency}</p>
            <p><strong>New Balance:</strong> ${Number(
              updatedUser.wallet?.balance || 0
            )} ${currency}</p>
            <p>If you have any questions, please contact support.</p>
          `,
        });
      }

      res.json({
        success: true,
        message: "Funds withdrawn successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          balance: Number(updatedUser.wallet?.balance || 0),
        },
      });
    } catch (error: any) {
      console.error("Admin fund withdrawal error:", error);
      res.status(500).json({ error: "Fund withdrawal failed" });
    }
  }
);

/**
 * Get fund transfer history
 * Super Admin only
 */
router.get(
  "/transfer-history",
  authenticate,
  requireRole("SUPERADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const activityLogs = await prisma.auditLog.findMany({
        where: {
          action: {
            in: ["ADMIN_FUND_TRANSFER", "ADMIN_FUND_WITHDRAWAL"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: Number(limit),
        skip: Number(offset),
      });

      res.json({
        activityLogs,
        count: activityLogs.length,
      });
    } catch (error: any) {
      console.error("Transfer history error:", error);
      res.status(500).json({ error: "Failed to fetch transfer history" });
    }
  }
);

/**
 * Get user balance
 * Super Admin only
 */
router.get(
  "/user-balance/:userId",
  authenticate,
  requireRole("SUPERADMIN"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          wallet: {
            select: { balance: true },
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error: any) {
      console.error("Get user balance error:", error);
      res.status(500).json({ error: "Failed to fetch user balance" });
    }
  }
);

export default router;
