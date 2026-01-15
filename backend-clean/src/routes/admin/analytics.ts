import { Router } from "express";
import { authenticate, AuthRequest, requireRole } from "../../middleware/auth";
import { adminAnalytics } from "../../services/adminAnalytics";
import { prisma } from "../../lib/prisma";

const router = Router();

// Get comprehensive analytics data
router.get(
  "/analytics",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const analytics = await adminAnalytics.getComprehensiveAnalytics(
        dateRange
      );

      res.json({
        success: true,
        data: analytics,
        dateRange,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get real-time metrics
router.get(
  "/analytics/realtime",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const realTimeMetrics = await adminAnalytics.getRealTimeMetrics();

      res.json({
        success: true,
        data: realTimeMetrics,
      });
    } catch (error) {
      console.error("Get real-time metrics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get overview analytics only
router.get(
  "/analytics/overview",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const now = new Date();
      const startDate = getStartDate(dateRange, now);

      // Use the method from the adminAnalytics class
      const analytics = await adminAnalytics.getComprehensiveAnalytics(
        dateRange
      );
      const overview = analytics.overview;

      res.json({
        success: true,
        data: overview,
        dateRange,
      });
    } catch (error) {
      console.error("Get overview analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get transaction analytics
router.get(
  "/analytics/transactions",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const now = new Date();
      const startDate = getStartDate(dateRange, now);

      const transactions = await adminAnalytics.getTransactionAnalytics(
        startDate,
        now
      );

      res.json({
        success: true,
        data: transactions,
        dateRange,
      });
    } catch (error) {
      console.error("Get transaction analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get user analytics
router.get(
  "/analytics/users",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const now = new Date();
      const startDate = getStartDate(dateRange, now);

      const users = await adminAnalytics.getUserAnalytics(startDate, now);

      res.json({
        success: true,
        data: users,
        dateRange,
      });
    } catch (error) {
      console.error("Get user analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get fraud analytics
router.get(
  "/analytics/fraud",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const now = new Date();
      const startDate = getStartDate(dateRange, now);

      const fraud = await adminAnalytics.getFraudAnalytics(startDate, now);

      res.json({
        success: true,
        data: fraud,
        dateRange,
      });
    } catch (error) {
      console.error("Get fraud analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get financial analytics
router.get(
  "/analytics/financial",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const now = new Date();
      const startDate = getStartDate(dateRange, now);

      const financial = await adminAnalytics.getFinancialAnalytics(
        startDate,
        now
      );

      res.json({
        success: true,
        data: financial,
        dateRange,
      });
    } catch (error) {
      console.error("Get financial analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get performance analytics
router.get(
  "/analytics/performance",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const now = new Date();
      const startDate = getStartDate(dateRange, now);

      const performance = await adminAnalytics.getPerformanceAnalytics(
        startDate,
        now
      );

      res.json({
        success: true,
        data: performance,
        dateRange,
      });
    } catch (error) {
      console.error("Get performance analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Export analytics data
router.get(
  "/analytics/export",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const dateRange =
        (req.query.dateRange as "7d" | "30d" | "90d" | "1y") || "30d";
      const format = (req.query.format as "json" | "csv") || "json";

      const analytics = await adminAnalytics.getComprehensiveAnalytics(
        dateRange
      );

      if (format === "csv") {
        // Convert to CSV and send as file
        const csv = convertToCSV(analytics);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="analytics-${dateRange}-${
            new Date().toISOString().split("T")[0]
          }.csv"`
        );
        res.send(csv);
      } else {
        // Send as JSON
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="analytics-${dateRange}-${
            new Date().toISOString().split("T")[0]
          }.json"`
        );
        res.json({
          success: true,
          data: analytics,
          dateRange,
          exportedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Export analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get dashboard summary (lightweight for frequent updates)
router.get(
  "/dashboard/summary",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [
        totalUsers,
        todayTransactions,
        todayVolume,
        weeklyTransactions,
        weeklyVolume,
        activeUsers,
        recentAlerts,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.transaction.count({
          where: { createdAt: { gte: today } },
        }),
        prisma.transaction.aggregate({
          where: {
            createdAt: { gte: today },
            status: "COMPLETED",
          },
          _sum: { amount: true },
        }),
        prisma.transaction.count({
          where: { createdAt: { gte: lastWeek } },
        }),
        prisma.transaction.aggregate({
          where: {
            createdAt: { gte: lastWeek },
            status: "COMPLETED",
          },
          _sum: { amount: true },
        }),
        prisma.userActivityLog
          .groupBy({
            by: ["userId"],
            where: {
              timestamp: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
            },
            _count: { userId: true },
          })
          .then((logs: any) => logs.length),
        prisma.fraudDetectionLog.count({
          where: {
            timestamp: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
          },
        }),
      ]);

      const summary = {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        transactions: {
          today: todayTransactions,
          weekly: weeklyTransactions,
          todayVolume: todayVolume._sum.amount || 0,
          weeklyVolume: weeklyVolume._sum.amount || 0,
        },
        alerts: {
          recent: recentAlerts,
        },
        timestamp: now.toISOString(),
      };

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error("Get dashboard summary error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Helper function to get start date
function getStartDate(range: string, now: Date): Date {
  const days =
    {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    }[range] || 30;

  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

// Helper function to convert analytics data to CSV
function convertToCSV(analytics: any): string {
  const headers = [
    "Date",
    "Total Users",
    "Active Users",
    "Transactions",
    "Volume",
    "Success Rate",
    "Fraud Alerts",
    "Revenue",
  ];

  const rows = analytics.transactions.dailyData.map((day: any) => [
    day.date,
    analytics.users.userActivity.find((ua: any) => ua.date === day.date)
      ?.totalUsers || 0,
    analytics.users.userActivity.find((ua: any) => ua.date === day.date)
      ?.activeUsers || 0,
    day.count,
    day.volume,
    day.successRate.toFixed(2),
    analytics.fraud.fraudTrends.find((ft: any) => ft.date === day.date)
      ?.highRisk || 0,
    analytics.financial.revenue.find((r: any) => r.date === day.date)?.amount ||
      0,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row: any[]) => row.join(",")),
  ].join("\n");

  return csvContent;
}

export default router;
