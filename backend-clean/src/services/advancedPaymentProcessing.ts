import { prisma } from "../lib/prisma";
import { fraudDetection } from "./fraudDetection";
import { AuthRequest } from "../middleware/auth";
import { realTimeMonitoring } from "./realTimeMonitoring";

export interface PaymentProcessingRequest {
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  destinationAddress?: string;
  description?: string;
  metadata?: Record<string, any>;
  ip: string;
  userAgent: string;
  deviceId?: string;
}

export interface PaymentProcessingResult {
  success: boolean;
  transactionId?: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  requiresAction: boolean;
  actionRequired?: string;
  reasons: string[];
  recommendations: string[];
  blocked?: boolean;
  message: string;
}

export class AdvancedPaymentProcessingService {
  private readonly processingLimits = {
    dailyLimit: 10000,
    weeklyLimit: 50000,
    monthlyLimit: 200000,
    maxSingleTransaction: 25000,
  };

  // Main payment processing method with fraud detection
  async processPayment(
    request: PaymentProcessingRequest,
    authReq: AuthRequest
  ): Promise<PaymentProcessingResult> {
    try {
      // Step 1: Advanced fraud detection
      const fraudAnalysis = await fraudDetection.advancedFraudDetection({
        userId: request.userId,
        amount: request.amount,
        currency: request.currency,
        paymentMethod: request.paymentMethod,
        destinationAddress: request.destinationAddress,
        ip: request.ip,
        userAgent: request.userAgent,
        deviceId: request.deviceId,
      });

      // Step 2: Check processing limits
      const limitCheck = await this.checkProcessingLimits(
        request.userId,
        request.amount
      );
      if (!limitCheck.withinLimits) {
        return {
          success: false,
          riskScore: 100,
          riskLevel: "CRITICAL",
          requiresAction: true,
          actionRequired: "CONTACT_SUPPORT",
          reasons: [
            ...fraudAnalysis.reasons,
            ...(limitCheck.reason ? [limitCheck.reason] : []),
          ],
          recommendations: ["Contact support for limit increase"],
          blocked: true,
          message: `Transaction exceeds ${limitCheck.limitType} limit`,
        };
      }

      // Step 3: Log fraud detection results
      await fraudDetection.logFraudDetection({
        userId: request.userId,
        riskScore: fraudAnalysis.riskScore,
        riskLevel: fraudAnalysis.riskLevel,
        reasons: fraudAnalysis.reasons,
        recommendations: fraudAnalysis.recommendations,
        ip: request.ip,
        userAgent: request.userAgent,
      });

      // Step 4: Determine if transaction should be blocked or require additional verification
      if (fraudAnalysis.riskLevel === "CRITICAL") {
        return {
          success: false,
          riskScore: fraudAnalysis.riskScore,
          riskLevel: fraudAnalysis.riskLevel,
          requiresAction: true,
          actionRequired: "MANUAL_REVIEW",
          reasons: fraudAnalysis.reasons,
          recommendations: fraudAnalysis.recommendations,
          blocked: true,
          message: "Transaction blocked due to high fraud risk",
        };
      }

      if (fraudAnalysis.riskLevel === "HIGH") {
        return {
          success: false,
          riskScore: fraudAnalysis.riskScore,
          riskLevel: fraudAnalysis.riskLevel,
          requiresAction: true,
          actionRequired: "ADDITIONAL_VERIFICATION",
          reasons: fraudAnalysis.reasons,
          recommendations: fraudAnalysis.recommendations,
          message: "Transaction requires additional verification",
        };
      }

      // Step 5: Process the payment if risk is acceptable
      const transaction = await this.createTransaction(request, fraudAnalysis);

      return {
        success: true,
        transactionId: transaction.id,
        riskScore: fraudAnalysis.riskScore,
        riskLevel: fraudAnalysis.riskLevel,
        requiresAction: false,
        reasons: fraudAnalysis.reasons,
        recommendations: fraudAnalysis.recommendations,
        message: "Payment processed successfully",
      };
    } catch (error) {
      console.error("Payment processing error:", error);
      return {
        success: false,
        riskScore: 0,
        riskLevel: "LOW",
        requiresAction: false,
        reasons: ["Processing error"],
        recommendations: ["Please try again or contact support"],
        message:
          error instanceof Error ? error.message : "Unknown processing error",
      };
    }
  }

  // Check if user is within processing limits
  private async checkProcessingLimits(
    userId: string,
    amount: number
  ): Promise<{ withinLimits: boolean; reason?: string; limitType?: string }> {
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

      // Check single transaction limit
      if (amount > this.processingLimits.maxSingleTransaction) {
        return {
          withinLimits: false,
          reason: `Amount $${amount} exceeds maximum single transaction limit of $${this.processingLimits.maxSingleTransaction}`,
          limitType: "single transaction",
        };
      }

      // Check daily limit
      const dailyTotal = await prisma.transaction.aggregate({
        where: {
          userId,
          status: "COMPLETED",
          createdAt: {
            gte: startOfDay,
          },
        },
        _sum: {
          amount: true,
        },
      });

      if (
        Number(dailyTotal._sum.amount || 0) + amount >
        this.processingLimits.dailyLimit
      ) {
        return {
          withinLimits: false,
          reason: `Daily limit of $${this.processingLimits.dailyLimit} would be exceeded`,
          limitType: "daily",
        };
      }

      // Check weekly limit
      const weeklyTotal = await prisma.transaction.aggregate({
        where: {
          userId,
          status: "COMPLETED",
          createdAt: {
            gte: startOfWeek,
          },
        },
        _sum: {
          amount: true,
        },
      });

      if (
        Number(weeklyTotal._sum.amount || 0) + amount >
        this.processingLimits.weeklyLimit
      ) {
        return {
          withinLimits: false,
          reason: `Weekly limit of $${this.processingLimits.weeklyLimit} would be exceeded`,
          limitType: "weekly",
        };
      }

      // Check monthly limit
      const monthlyTotal = await prisma.transaction.aggregate({
        where: {
          userId,
          status: "COMPLETED",
          createdAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      if (
        Number(monthlyTotal._sum.amount || 0) + amount >
        this.processingLimits.monthlyLimit
      ) {
        return {
          withinLimits: false,
          reason: `Monthly limit of $${this.processingLimits.monthlyLimit} would be exceeded`,
          limitType: "monthly",
        };
      }

      return { withinLimits: true };
    } catch (error) {
      console.error("Error checking processing limits:", error);
      return { withinLimits: false, reason: "Unable to verify limits" };
    }
  }

  // Create transaction record
  private async createTransaction(
    request: PaymentProcessingRequest,
    fraudAnalysis: any
  ) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          userId: request.userId,
          walletId: await this.getUserWalletId(request.userId),
          type: "PAYMENT" as any,
          amount: request.amount,
          currency: request.currency,
          status:
            fraudAnalysis.riskLevel === "MEDIUM" ? "PENDING" : "COMPLETED",
          method: request.paymentMethod as any,
          metadata: {
            ...request.metadata,
            fraudRiskScore: fraudAnalysis.riskScore,
            fraudRiskLevel: fraudAnalysis.riskLevel,
            fraudReasons: fraudAnalysis.reasons,
            description: request.description,
            destinationAddress: request.destinationAddress,
            ipAddress: request.ip,
            userAgent: request.userAgent,
          },
        },
      });

      // Update wallet balance if completed
      if (transaction.status === "COMPLETED") {
        await this.updateWalletBalance(request.userId, request.amount, "DEBIT");
      }

      // Process transaction for real-time monitoring
      if (realTimeMonitoring) {
        await realTimeMonitoring.processTransaction({
          userId: request.userId,
          amount: request.amount,
          currency: request.currency,
          paymentMethod: request.paymentMethod,
          riskScore: fraudAnalysis.riskScore,
          status: transaction.status,
          transactionId: transaction.id,
        });
      }

      return transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new Error("Failed to create transaction");
    }
  }

  // Get user's wallet ID
  private async getUserWalletId(userId: string): Promise<string> {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new Error("User wallet not found");
    }

    return wallet.id;
  }

  // Update wallet balance
  private async updateWalletBalance(
    userId: string,
    amount: number,
    type: "CREDIT" | "DEBIT"
  ) {
    try {
      const adjustment = type === "DEBIT" ? -amount : amount;
      await prisma.wallet.update({
        where: { userId },
        data: {
          balance: {
            increment: adjustment,
          },
        },
      });
    } catch (error) {
      console.error("Error updating wallet balance:", error);
      throw new Error("Failed to update wallet balance");
    }
  }

  // Get transaction status and details
  async getTransactionStatus(transactionId: string, userId: string) {
    try {
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
          userId,
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        method: transaction.method,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        metadata: transaction.metadata,
      };
    } catch (error) {
      console.error("Error getting transaction status:", error);
      throw new Error("Failed to get transaction status");
    }
  }

  // Get user's transaction history with fraud analysis
  async getTransactionHistory(userId: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;

      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          include: {
            wallet: {
              select: {
                balance: true,
              },
            },
          },
        }),
        prisma.transaction.count({
          where: { userId },
        }),
      ]);

      return {
        transactions: transactions.map((tx: any) => ({
          id: tx.id,
          amount: tx.amount,
          currency: tx.currency,
          status: tx.status,
          method: tx.method,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
          fraudRiskScore: tx.metadata
            ? (tx.metadata as any).fraudRiskScore
            : undefined,
          fraudRiskLevel: tx.metadata
            ? (tx.metadata as any).fraudRiskLevel
            : undefined,
          fraudReasons: tx.metadata
            ? (tx.metadata as any).fraudReasons || []
            : [],
          description: tx.metadata
            ? (tx.metadata as any).description
            : undefined,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error getting transaction history:", error);
      throw new Error("Failed to get transaction history");
    }
  }

  // Get fraud detection logs for admin
  async getFraudDetectionLogs(page = 1, limit = 50, riskLevel?: string) {
    try {
      const skip = (page - 1) * limit;
      const where = riskLevel ? { riskLevel } : {};

      const [logs, total] = await Promise.all([
        prisma.fraudDetectionLog.findMany({
          where,
          orderBy: { timestamp: "desc" },
          skip,
          take: limit,
          include: {
            user: {
              select: {
                email: true,
                role: true,
              },
            },
          },
        }),
        prisma.fraudDetectionLog.count({ where }),
      ]);

      return {
        logs: logs.map((log: any) => ({
          id: log.id,
          userId: log.userId,
          userEmail: log.user.email,
          userRole: log.user.role,
          transactionId: log.transactionId,
          riskScore: log.riskScore,
          riskLevel: log.riskLevel,
          reasons: log.reasons,
          recommendations: log.recommendations,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          timestamp: log.timestamp,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error getting fraud detection logs:", error);
      throw new Error("Failed to get fraud detection logs");
    }
  }
}

export const advancedPaymentProcessing = new AdvancedPaymentProcessingService();
