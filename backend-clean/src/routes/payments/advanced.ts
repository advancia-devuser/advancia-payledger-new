import { Router } from "express";
import { authenticate, AuthRequest, requireRole } from "../../middleware/auth";
import { advancedPaymentProcessing } from "../../services/advancedPaymentProcessing";
import { fraudDetection } from "../../services/fraudDetection";
import { prisma } from "../../lib/prisma";

const router = Router();

// Process payment with advanced fraud detection
router.post("/process", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      amount,
      currency,
      paymentMethod,
      destinationAddress,
      description,
      metadata,
    } = req.body;

    // Validate required fields
    if (!amount || !currency || !paymentMethod) {
      return res.status(400).json({
        error: "Missing required fields: amount, currency, paymentMethod",
      });
    }

    // Get client IP and user agent
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.get("user-agent") || "unknown";

    const paymentRequest = {
      userId,
      amount: parseFloat(amount),
      currency,
      paymentMethod,
      destinationAddress,
      description,
      metadata,
      ip,
      userAgent,
      deviceId: req.headers["device-id"] as string,
    };

    const result = await advancedPaymentProcessing.processPayment(
      paymentRequest,
      req
    );

    if (result.success) {
      res.json({
        success: true,
        transactionId: result.transactionId,
        riskScore: result.riskScore,
        riskLevel: result.riskLevel,
        message: result.message,
        warnings: result.reasons,
      });
    } else {
      if (result.blocked) {
        return res.status(403).json({
          success: false,
          error: result.message,
          riskScore: result.riskScore,
          riskLevel: result.riskLevel,
          requiresAction: result.requiresAction,
          actionRequired: result.actionRequired,
          reasons: result.reasons,
          recommendations: result.recommendations,
        });
      } else if (result.requiresAction) {
        return res.status(202).json({
          success: false,
          error: result.message,
          riskScore: result.riskScore,
          riskLevel: result.riskLevel,
          requiresAction: result.requiresAction,
          actionRequired: result.actionRequired,
          reasons: result.reasons,
          recommendations: result.recommendations,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: result.message,
          riskScore: result.riskScore,
          riskLevel: result.riskLevel,
          reasons: result.reasons,
        });
      }
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get transaction status
router.get(
  "/status/:transactionId",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { transactionId } = req.params;
      const status = await advancedPaymentProcessing.getTransactionStatus(
        transactionId,
        userId
      );

      res.json({
        success: true,
        transaction: status,
      });
    } catch (error) {
      console.error("Get transaction status error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get user's transaction history
router.get("/history", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const history = await advancedPaymentProcessing.getTransactionHistory(
      userId,
      page,
      limit
    );

    res.json({
      success: true,
      ...history,
    });
  } catch (error) {
    console.error("Get transaction history error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Pre-transaction risk assessment (without creating transaction)
router.post("/risk-assessment", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { amount, currency, paymentMethod, destinationAddress } = req.body;

    // Validate required fields
    if (!amount || !currency || !paymentMethod) {
      return res.status(400).json({
        error: "Missing required fields: amount, currency, paymentMethod",
      });
    }

    // Get client IP and user agent
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.get("user-agent") || "unknown";

    const fraudAnalysis = await fraudDetection.advancedFraudDetection({
      userId,
      amount: parseFloat(amount),
      currency,
      paymentMethod,
      destinationAddress,
      ip,
      userAgent,
      deviceId: req.headers["device-id"] as string,
    });

    res.json({
      success: true,
      riskAssessment: {
        riskScore: fraudAnalysis.riskScore,
        riskLevel: fraudAnalysis.riskLevel,
        isFraudulent: fraudAnalysis.isFraudulent,
        reasons: fraudAnalysis.reasons,
        recommendations: fraudAnalysis.recommendations,
        canProceed: fraudAnalysis.riskLevel !== "CRITICAL",
        requiresAdditionalVerification: fraudAnalysis.riskLevel === "HIGH",
      },
    });
  } catch (error) {
    console.error("Risk assessment error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Admin routes

// Get fraud detection logs (admin only)
router.get(
  "/admin/fraud-logs",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const riskLevel = req.query.riskLevel as string;

      const logs = await advancedPaymentProcessing.getFraudDetectionLogs(
        page,
        limit,
        riskLevel
      );

      res.json({
        success: true,
        ...logs,
      });
    } catch (error) {
      console.error("Get fraud logs error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get payment processing statistics (admin only)
router.get(
  "/admin/stats",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const stats = await getPaymentProcessingStats();

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error("Get payment stats error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Helper function for payment processing statistics
async function getPaymentProcessingStats() {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalTransactions,
      todayTransactions,
      weeklyTransactions,
      monthlyTransactions,
      highRiskTransactions,
      blockedTransactions,
      totalVolume,
      todayVolume,
      fraudLogs,
    ] = await Promise.all([
      prisma.transaction.count(),
      prisma.transaction.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      prisma.transaction.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.transaction.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.fraudDetectionLog.count({
        where: { riskLevel: "HIGH" },
      }),
      prisma.fraudDetectionLog.count({
        where: { riskLevel: "CRITICAL" },
      }),
      prisma.transaction.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startOfDay },
        },
        _sum: { amount: true },
      }),
      prisma.fraudDetectionLog.count({
        where: {
          timestamp: {
            gte: startOfDay,
          },
        },
      }),
    ]);

    return {
      transactions: {
        total: totalTransactions,
        today: todayTransactions,
        thisWeek: weeklyTransactions,
        thisMonth: monthlyTransactions,
      },
      volume: {
        total: totalVolume._sum.amount || 0,
        today: todayVolume._sum.amount || 0,
      },
      fraud: {
        highRiskCount: highRiskTransactions,
        blockedCount: blockedTransactions,
        todayFraudAlerts: fraudLogs,
      },
      riskDistribution: await getRiskDistribution(),
    };
  } catch (error) {
    console.error("Error getting payment stats:", error);
    throw error;
  }
}

// Helper function for risk distribution
async function getRiskDistribution() {
  try {
    const [low, medium, high, critical] = await Promise.all([
      prisma.fraudDetectionLog.count({ where: { riskLevel: "LOW" } }),
      prisma.fraudDetectionLog.count({ where: { riskLevel: "MEDIUM" } }),
      prisma.fraudDetectionLog.count({ where: { riskLevel: "HIGH" } }),
      prisma.fraudDetectionLog.count({ where: { riskLevel: "CRITICAL" } }),
    ]);

    const total = low + medium + high + critical;

    return {
      LOW: {
        count: low,
        percentage: total > 0 ? ((low / total) * 100).toFixed(2) : "0",
      },
      MEDIUM: {
        count: medium,
        percentage: total > 0 ? ((medium / total) * 100).toFixed(2) : "0",
      },
      HIGH: {
        count: high,
        percentage: total > 0 ? ((high / total) * 100).toFixed(2) : "0",
      },
      CRITICAL: {
        count: critical,
        percentage: total > 0 ? ((critical / total) * 100).toFixed(2) : "0",
      },
    };
  } catch (error) {
    console.error("Error getting risk distribution:", error);
    return {
      LOW: { count: 0, percentage: "0" },
      MEDIUM: { count: 0, percentage: "0" },
      HIGH: { count: 0, percentage: "0" },
      CRITICAL: { count: 0, percentage: "0" },
    };
  }
}

export default router;
