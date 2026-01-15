import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { prisma } from "../lib/prisma";
import "../types/socket";
import { fraudDetection } from "./fraudDetection";

export interface TransactionAlert {
  id: string;
  userId: string;
  type:
    | "FRAUD_DETECTED"
    | "LARGE_TRANSACTION"
    | "SUSPICIOUS_ACTIVITY"
    | "PAYMENT_FAILED"
    | "LIMIT_EXCEEDED";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  riskScore?: number;
  timestamp: Date;
  isRead: boolean;
  metadata?: Record<string, any>;
}

export interface MonitoringRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    amountThreshold?: number;
    riskScoreThreshold?: number;
    transactionFrequency?: number;
    timeWindowMinutes?: number;
    paymentMethods?: string[];
    countries?: string[];
  };
  actions: {
    sendAlert: boolean;
    blockTransaction: boolean;
    requireVerification: boolean;
    notifyAdmin: boolean;
  };
  alertType: TransactionAlert["type"];
  severity: TransactionAlert["severity"];
}

export class RealTimeMonitoringService {
  private io: Server;
  private connectedUsers: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds
  private monitoringRules: Map<string, MonitoringRule> = new Map();
  private alertCache: Map<string, TransactionAlert[]> = new Map(); // userId -> alerts

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.initializeSocketHandlers();
    this.initializeDefaultRules();
    this.startMonitoringProcesses();
  }

  private initializeSocketHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected to real-time monitoring: ${socket.id}`);

      // Handle user authentication for monitoring
      socket.on(
        "authenticate",
        async (data: { userId: string; token: string }) => {
          try {
            // Verify token (simplified - in production use proper JWT verification)
            const user = await prisma.user.findUnique({
              where: { id: data.userId },
            });

            if (user) {
              socket.userId = data.userId;
              socket.join(`user_${data.userId}`);

              // Track connected users
              if (!this.connectedUsers.has(data.userId)) {
                this.connectedUsers.set(data.userId, new Set());
              }
              this.connectedUsers.get(data.userId)!.add(socket.id);

              // Send cached alerts
              const userAlerts = this.alertCache.get(data.userId) || [];
              socket.emit("initial_alerts", userAlerts);

              console.log(`User ${data.userId} authenticated for monitoring`);
              socket.emit("authenticated", { success: true });
            } else {
              socket.emit("authentication_error", { error: "Invalid user" });
            }
          } catch (error) {
            console.error("Authentication error:", error);
            socket.emit("authentication_error", {
              error: "Authentication failed",
            });
          }
        }
      );

      // Handle alert acknowledgment
      socket.on("acknowledge_alert", async (data: { alertId: string }) => {
        try {
          if (socket.userId) {
            await this.markAlertAsRead(data.alertId, socket.userId);
            socket.emit("alert_acknowledged", { alertId: data.alertId });
          }
        } catch (error) {
          console.error("Error acknowledging alert:", error);
          socket.emit("error", { message: "Failed to acknowledge alert" });
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        if (socket.userId) {
          const userSockets = this.connectedUsers.get(socket.userId);
          if (userSockets) {
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
              this.connectedUsers.delete(socket.userId);
            }
          }
        }
        console.log(`User disconnected from monitoring: ${socket.id}`);
      });
    });
  }

  private initializeDefaultRules() {
    const defaultRules: MonitoringRule[] = [
      {
        id: "high_fraud_risk",
        name: "High Fraud Risk Detection",
        description: "Alert when transaction risk score exceeds 80",
        enabled: true,
        conditions: {
          riskScoreThreshold: 80,
        },
        actions: {
          sendAlert: true,
          blockTransaction: false,
          requireVerification: true,
          notifyAdmin: true,
        },
        alertType: "FRAUD_DETECTED",
        severity: "HIGH",
      },
      {
        id: "critical_fraud_risk",
        name: "Critical Fraud Risk Detection",
        description: "Alert when transaction risk score exceeds 90",
        enabled: true,
        conditions: {
          riskScoreThreshold: 90,
        },
        actions: {
          sendAlert: true,
          blockTransaction: true,
          requireVerification: true,
          notifyAdmin: true,
        },
        alertType: "FRAUD_DETECTED",
        severity: "CRITICAL",
      },
      {
        id: "large_transaction",
        name: "Large Transaction Alert",
        description: "Alert for transactions over $10,000",
        enabled: true,
        conditions: {
          amountThreshold: 10000,
        },
        actions: {
          sendAlert: true,
          blockTransaction: false,
          requireVerification: false,
          notifyAdmin: false,
        },
        alertType: "LARGE_TRANSACTION",
        severity: "MEDIUM",
      },
      {
        id: "very_large_transaction",
        name: "Very Large Transaction Alert",
        description: "Alert for transactions over $50,000",
        enabled: true,
        conditions: {
          amountThreshold: 50000,
        },
        actions: {
          sendAlert: true,
          blockTransaction: false,
          requireVerification: true,
          notifyAdmin: true,
        },
        alertType: "LARGE_TRANSACTION",
        severity: "HIGH",
      },
      {
        id: "rapid_transactions",
        name: "Rapid Transaction Detection",
        description: "Alert for more than 5 transactions in 10 minutes",
        enabled: true,
        conditions: {
          transactionFrequency: 5,
          timeWindowMinutes: 10,
        },
        actions: {
          sendAlert: true,
          blockTransaction: false,
          requireVerification: true,
          notifyAdmin: false,
        },
        alertType: "SUSPICIOUS_ACTIVITY",
        severity: "MEDIUM",
      },
      {
        id: "payment_failure",
        name: "Payment Failure Alert",
        description: "Alert when payment processing fails",
        enabled: true,
        conditions: {},
        actions: {
          sendAlert: true,
          blockTransaction: false,
          requireVerification: false,
          notifyAdmin: false,
        },
        alertType: "PAYMENT_FAILED",
        severity: "LOW",
      },
    ];

    defaultRules.forEach((rule) => {
      this.monitoringRules.set(rule.id, rule);
    });
  }

  private startMonitoringProcesses() {
    // Check for rapid transactions every minute
    setInterval(async () => {
      await this.checkRapidTransactions();
    }, 60000);

    // Clean old alerts every hour
    setInterval(async () => {
      await this.cleanOldAlerts();
    }, 3600000);
  }

  async processTransaction(transactionData: {
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    riskScore?: number;
    status: string;
    transactionId: string;
  }) {
    const alerts: TransactionAlert[] = [];

    // Check each monitoring rule
    for (const rule of Array.from(this.monitoringRules.values())) {
      if (!rule.enabled) continue;

      const shouldAlert = await this.evaluateRule(rule, transactionData);
      if (shouldAlert) {
        const alert = await this.createAlert(rule, transactionData);
        alerts.push(alert);
      }
    }

    // Send alerts to connected users
    if (alerts.length > 0) {
      await this.sendAlerts(alerts);
    }

    return alerts;
  }

  private async evaluateRule(
    rule: MonitoringRule,
    transactionData: any
  ): Promise<boolean> {
    const { conditions } = rule;

    // Amount threshold check
    if (
      conditions.amountThreshold &&
      transactionData.amount >= conditions.amountThreshold
    ) {
      return true;
    }

    // Risk score threshold check
    if (
      conditions.riskScoreThreshold &&
      transactionData.riskScore &&
      transactionData.riskScore >= conditions.riskScoreThreshold
    ) {
      return true;
    }

    // Payment method check
    if (
      conditions.paymentMethods &&
      conditions.paymentMethods.includes(transactionData.paymentMethod)
    ) {
      return true;
    }

    return false;
  }

  public async createAlert(
    rule: MonitoringRule,
    transactionData: any
  ): Promise<TransactionAlert> {
    const alert: TransactionAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: transactionData.userId,
      type: rule.alertType,
      severity: rule.severity,
      title: this.generateAlertTitle(rule, transactionData),
      message: this.generateAlertMessage(rule, transactionData),
      transactionId: transactionData.transactionId,
      amount: transactionData.amount,
      currency: transactionData.currency,
      paymentMethod: transactionData.paymentMethod,
      riskScore: transactionData.riskScore,
      timestamp: new Date(),
      isRead: false,
      metadata: {
        ruleId: rule.id,
        ruleName: rule.name,
        ...transactionData,
      },
    };

    // Cache alert for user
    if (!this.alertCache.has(transactionData.userId)) {
      this.alertCache.set(transactionData.userId, []);
    }
    this.alertCache.get(transactionData.userId)!.push(alert);

    // Store in database
    await this.storeAlert(alert);

    return alert;
  }

  private generateAlertTitle(
    rule: MonitoringRule,
    transactionData: any
  ): string {
    switch (rule.alertType) {
      case "FRAUD_DETECTED":
        return `Fraud Risk Alert - ${rule.severity}`;
      case "LARGE_TRANSACTION":
        return `Large Transaction Alert`;
      case "SUSPICIOUS_ACTIVITY":
        return `Suspicious Activity Detected`;
      case "PAYMENT_FAILED":
        return `Payment Processing Failed`;
      case "LIMIT_EXCEEDED":
        return `Transaction Limit Exceeded`;
      default:
        return "Transaction Alert";
    }
  }

  private generateAlertMessage(
    rule: MonitoringRule,
    transactionData: any
  ): string {
    const { amount, currency, paymentMethod, riskScore } = transactionData;

    switch (rule.alertType) {
      case "FRAUD_DETECTED":
        return `High fraud risk detected for transaction of $${amount} ${currency} via ${paymentMethod}. Risk score: ${riskScore}`;
      case "LARGE_TRANSACTION":
        return `Large transaction of $${amount} ${currency} detected via ${paymentMethod}`;
      case "SUSPICIOUS_ACTIVITY":
        return `Suspicious activity detected: Multiple transactions in short time period`;
      case "PAYMENT_FAILED":
        return `Payment processing failed for transaction of $${amount} ${currency}`;
      case "LIMIT_EXCEEDED":
        return `Transaction limit exceeded for $${amount} ${currency}`;
      default:
        return `Transaction alert for $${amount} ${currency}`;
    }
  }

  private async storeAlert(alert: TransactionAlert) {
    try {
      // Store in database (would need Alert model in schema)
      console.log(`Storing alert: ${alert.id} for user ${alert.userId}`);
    } catch (error) {
      console.error("Error storing alert:", error);
    }
  }

  public async sendAlerts(alerts: TransactionAlert[]) {
    for (const alert of alerts) {
      // Send to user's connected sockets
      this.io.to(`user_${alert.userId}`).emit("transaction_alert", alert);

      // Send to admin if required
      if (alert.metadata?.notifyAdmin) {
        this.io.to("admin_monitoring").emit("admin_alert", alert);
      }

      console.log(
        `Alert sent: ${alert.type} - ${alert.title} to user ${alert.userId}`
      );
    }
  }

  private async checkRapidTransactions() {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      // Find users with rapid transactions
      const rapidTransactions = await prisma.transaction.groupBy({
        by: ["userId"],
        where: {
          createdAt: {
            gte: tenMinutesAgo,
          },
        },
        _count: {
          userId: true,
        },
        having: {
          userId: {
            _count: {
              gt: 5,
            },
          },
        },
      });

      for (const rapidTx of rapidTransactions) {
        const rule = this.monitoringRules.get("rapid_transactions");
        if (rule && rule.enabled) {
          const alert = await this.createAlert(rule, {
            userId: rapidTx.userId,
            transactionCount: rapidTx._count.userId,
            timeWindow: "10 minutes",
          });
          await this.sendAlerts([alert]);
        }
      }
    } catch (error) {
      console.error("Error checking rapid transactions:", error);
    }
  }

  private async cleanOldAlerts() {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Clean old alerts from cache
      for (const [userId, alerts] of this.alertCache.entries()) {
        const filteredAlerts = alerts.filter(
          (alert) => alert.timestamp > oneWeekAgo
        );
        this.alertCache.set(userId, filteredAlerts);
      }

      console.log("Cleaned old alerts from cache");
    } catch (error) {
      console.error("Error cleaning old alerts:", error);
    }
  }

  async markAlertAsRead(alertId: string, userId: string) {
    try {
      const userAlerts = this.alertCache.get(userId) || [];
      const alert = userAlerts.find((a) => a.id === alertId);

      if (alert) {
        alert.isRead = true;
        console.log(`Alert ${alertId} marked as read by user ${userId}`);
      }
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  }

  async getUserAlerts(
    userId: string,
    includeRead = false
  ): Promise<TransactionAlert[]> {
    const alerts = this.alertCache.get(userId) || [];
    return includeRead ? alerts : alerts.filter((alert) => !alert.isRead);
  }

  async addMonitoringRule(
    rule: Omit<MonitoringRule, "id">
  ): Promise<MonitoringRule> {
    const newRule: MonitoringRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    this.monitoringRules.set(newRule.id, newRule);
    console.log(`Added monitoring rule: ${newRule.name}`);

    return newRule;
  }

  async updateMonitoringRule(
    ruleId: string,
    updates: Partial<MonitoringRule>
  ): Promise<MonitoringRule | null> {
    const rule = this.monitoringRules.get(ruleId);
    if (!rule) return null;

    const updatedRule = { ...rule, ...updates };
    this.monitoringRules.set(ruleId, updatedRule);

    console.log(`Updated monitoring rule: ${updatedRule.name}`);
    return updatedRule;
  }

  async deleteMonitoringRule(ruleId: string): Promise<boolean> {
    const deleted = this.monitoringRules.delete(ruleId);
    if (deleted) {
      console.log(`Deleted monitoring rule: ${ruleId}`);
    }
    return deleted;
  }

  getMonitoringRules(): MonitoringRule[] {
    return Array.from(this.monitoringRules.values());
  }

  // Admin monitoring
  async getSystemAlerts(
    severity?: TransactionAlert["severity"]
  ): Promise<TransactionAlert[]> {
    const allAlerts: TransactionAlert[] = [];

    for (const alerts of this.alertCache.values()) {
      allAlerts.push(...alerts);
    }

    return severity
      ? allAlerts.filter((alert) => alert.severity === severity)
      : allAlerts;
  }

  async getMonitoringStats(): Promise<{
    totalAlerts: number;
    alertsByType: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    activeRules: number;
    connectedUsers: number;
  }> {
    const allAlerts = await this.getSystemAlerts();

    const alertsByType = allAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const alertsBySeverity = allAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAlerts: allAlerts.length,
      alertsByType,
      alertsBySeverity,
      activeRules: Array.from(this.monitoringRules.values()).filter(
        (rule) => rule.enabled
      ).length,
      connectedUsers: this.connectedUsers.size,
    };
  }
}

export let realTimeMonitoring: RealTimeMonitoringService;

// Initialize function to be called after server creation
export function initializeRealTimeMonitoring(
  server: any
): RealTimeMonitoringService {
  realTimeMonitoring = new RealTimeMonitoringService(server);
  return realTimeMonitoring;
}
