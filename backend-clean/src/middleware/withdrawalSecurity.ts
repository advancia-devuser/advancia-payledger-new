import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import prisma from "../lib/prisma";
import emailService from "../services/emailService";

// Withdrawal limits based on trust score
export const WITHDRAWAL_LIMITS = {
  low: 100,
  medium: 1000,
  high: 10000,
  verified: 50000,
};

// Trust score to limit tier mapping
function getTrustScoreTier(trustScore: number): keyof typeof WITHDRAWAL_LIMITS {
  if (trustScore >= 90) return "verified";
  if (trustScore >= 70) return "high";
  if (trustScore >= 50) return "medium";
  return "low";
}

/**
 * Check withdrawal limits based on user's trust score
 */
export async function checkWithdrawalLimit(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { amount } = req.body;
    const userId = req.user!.userId;

    // Get user's role and wallet for trust score
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        wallet: {
          select: { balance: true },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Super admins bypass limits
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      next();
      return;
    }

    // Use wallet balance as trust score proxy (higher balance = higher trust)
    const trustScore =
      Number(user.wallet?.balance || 0) > 1000
        ? 90
        : Number(user.wallet?.balance || 0) > 100
        ? 70
        : Number(user.wallet?.balance || 0) > 10
        ? 50
        : 0;
    const tier = getTrustScoreTier(trustScore);
    const limit = WITHDRAWAL_LIMITS[tier];

    if (amount > limit) {
      res.status(400).json({
        error: "Withdrawal amount exceeds your limit",
        currentLimit: limit,
        requestedAmount: amount,
        trustScore,
        tier,
        message: `Your current withdrawal limit is $${limit}. Increase your trust score to unlock higher limits.`,
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Withdrawal limit check error:", error);
    res.status(500).json({ error: "Failed to check withdrawal limit" });
  }
}

/**
 * Verify 2FA for large withdrawals
 */
export async function verify2FAForLargeWithdrawal(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { amount, twoFactorCode } = req.body;
    const userId = req.user!.userId;

    // Require 2FA for withdrawals over $1000
    if (amount > 1000) {
      if (!twoFactorCode) {
        res.status(400).json({
          error: "2FA verification required",
          message: "Withdrawals over $1,000 require two-factor authentication",
          requires2FA: true,
        });
        return;
      }

      // Get user's 2FA secret
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { twoFactorSecret: true, twoFactorEnabled: true },
      });

      if (!user?.twoFactorEnabled) {
        res.status(400).json({
          error: "2FA not enabled",
          message:
            "Please enable 2FA in your settings to make large withdrawals",
        });
        return;
      }

      // Verify 2FA code (implement actual verification with speakeasy or similar)
      // For now, we'll add a placeholder
      const isValid = await verify2FACode(user.twoFactorSecret, twoFactorCode);

      if (!isValid) {
        res.status(401).json({
          error: "Invalid 2FA code",
          message: "The two-factor authentication code is incorrect",
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error("2FA verification error:", error);
    res.status(500).json({ error: "Failed to verify 2FA" });
  }
}

/**
 * Check if wallet address is whitelisted
 */
export async function checkAddressWhitelist(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { walletAddress, currency } = req.body;
    const userId = req.user!.userId;

    // Only check for crypto withdrawals
    if (currency !== "CRYPTO" || !walletAddress) {
      next();
      return;
    }

    // Check if address is whitelisted (using Withdrawal model)
    const withdrawalAddress = await prisma.withdrawal.findFirst({
      where: {
        userId,
        cryptoAddress: walletAddress,
        status: "APPROVED", // Only check approved addresses
      },
    });

    if (!withdrawalAddress) {
      res.status(400).json({
        error: "Address not whitelisted",
        message:
          "For security, you can only withdraw to pre-approved wallet addresses. Please add this address to your whitelist first.",
        walletAddress,
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Address whitelist check error:", error);
    // If table doesn't exist, allow withdrawal (backward compatibility)
    next();
  }
}

/**
 * Send withdrawal confirmation email
 */
export async function sendWithdrawalNotification(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { amount, currency, method } = req.body;
    const userId = req.user!.userId;

    // Get user email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true },
    });

    if (user?.email) {
      // Send confirmation email
      await emailService.sendEmail({
        to: user.email,
        subject: "Withdrawal Request Received - Advancia Pay",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .detail-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e5e7eb; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Withdrawal Request Received</h1>
              </div>
              <div class="content">
                <p>Hi ${user.firstName || user.email || "there"},</p>
                <p>We've received your withdrawal request and it's being processed.</p>

                <div class="detail-box">
                  <h3 style="margin-top: 0;">Withdrawal Details</h3>
                  <div class="detail-row">
                    <span><strong>Amount:</strong></span>
                    <span>${amount} ${currency}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Method:</strong></span>
                    <span>${method || "Default"}</span>
                  </div>
                  <div class="detail-row" style="border-bottom: none;">
                    <span><strong>Status:</strong></span>
                    <span style="color: #f59e0b; font-weight: bold;">Pending</span>
                  </div>
                </div>

                <div class="warning">
                  <strong>⏱️ Processing Time:</strong>
                  <p style="margin: 5px 0 0 0;">Most withdrawals are processed within 24-48 hours. You'll receive another email once your withdrawal is complete.</p>
                </div>

                <p><strong>What happens next?</strong></p>
                <ul>
                  <li>Our team will review your withdrawal request</li>
                  <li>Funds will be sent to your designated account</li>
                  <li>You'll receive a confirmation email</li>
                </ul>

                <p>If you didn't request this withdrawal, please contact support immediately at <a href="mailto:support@advancia.com">support@advancia.com</a></p>
              </div>
              <div class="footer">
                <p>© 2026 Advancia Pay. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    }

    next();
  } catch (error) {
    console.error("Withdrawal notification error:", error);
    // Don't block withdrawal if email fails
    next();
  }
}

/**
 * Rate limit withdrawals
 */
export async function rateLimitWithdrawalRequests(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Count withdrawals in last 24 hours
    const recentWithdrawals = await prisma.auditLog.count({
      where: {
        userId,
        action: "WITHDRAWAL_REQUEST",
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    // Max 5 withdrawals per day
    if (recentWithdrawals >= 5) {
      res.status(429).json({
        error: "Withdrawal limit exceeded",
        message:
          "You can only make 5 withdrawal requests per 24 hours. Please try again later.",
        recentWithdrawals,
        maxAllowed: 5,
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Don't block withdrawal if check fails
    next();
  }
}

// Helper function for 2FA verification (placeholder)
async function verify2FACode(
  secret: string | null,
  code: string
): Promise<boolean> {
  // TODO: Implement actual 2FA verification with speakeasy or similar library
  // For now, return true if code is provided (development mode)
  return Boolean(code && code.length === 6);
}

export default {
  checkWithdrawalLimit,
  verify2FAForLargeWithdrawal,
  checkAddressWhitelist,
  sendWithdrawalNotification,
  rateLimitWithdrawalRequests,
};
