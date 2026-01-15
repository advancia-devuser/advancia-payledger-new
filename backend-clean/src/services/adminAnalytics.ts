import { prisma } from "../lib/prisma";

export interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalTransactions: number;
    totalVolume: number;
    todayTransactions: number;
    todayVolume: number;
    monthlyGrowth: number;
    successRate: number;
  };
  transactions: {
    dailyData: Array<{
      date: string;
      count: number;
      volume: number;
      successRate: number;
    }>;
    paymentMethods: Array<{
      method: string;
      count: number;
      volume: number;
      percentage: number;
    }>;
    statusBreakdown: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    riskDistribution: Array<{
      level: string;
      count: number;
      percentage: number;
    }>;
  };
  users: {
    newUsers: Array<{
      date: string;
      count: number;
    }>;
    userActivity: Array<{
      date: string;
      activeUsers: number;
      totalUsers: number;
    }>;
    topUsers: Array<{
      userId: string;
      email: string;
      transactionCount: number;
      totalVolume: number;
    }>;
    userRetention: {
      day1: number;
      day7: number;
      day30: number;
    };
  };
  fraud: {
    fraudTrends: Array<{
      date: string;
      highRisk: number;
      critical: number;
      blocked: number;
    }>;
    topRiskFactors: Array<{
      factor: string;
      count: number;
      percentage: number;
    }>;
    geographicRisks: Array<{
      country: string;
      riskCount: number;
      riskScore: number;
    }>;
    deviceAnalysis: Array<{
      deviceType: string;
      riskCount: number;
      totalCount: number;
    }>;
  };
  financial: {
    revenue: Array<{
      date: string;
      amount: number;
      fees: number;
    }>;
    processingCosts: Array<{
      date: string;
      amount: number;
    }>;
    profitMargins: Array<{
      date: string;
      margin: number;
    }>;
    currencyBreakdown: Array<{
      currency: string;
      volume: number;
      percentage: number;
    }>;
  };
  performance: {
    apiResponseTimes: Array<{
      timestamp: string;
      avgResponseTime: number;
      p95ResponseTime: number;
      errorRate: number;
    }>;
    systemHealth: {
      uptime: number;
      errorRate: number;
      avgResponseTime: number;
      activeConnections: number;
    };
    databaseStats: {
      totalQueries: number;
      avgQueryTime: number;
      slowQueries: number;
    };
  };
}

export class AdminAnalyticsService {
  async getComprehensiveAnalytics(
    dateRange: "7d" | "30d" | "90d" | "1y" = "30d"
  ): Promise<AnalyticsData> {
    const now = new Date();
    const startDate = this.getStartDate(dateRange, now);

    const [overview, transactions, users, fraud, financial, performance] =
      await Promise.all([
        this.getOverviewAnalytics(startDate, now),
        this.getTransactionAnalytics(startDate, now),
        this.getUserAnalytics(startDate, now),
        this.getFraudAnalytics(startDate, now),
        this.getFinancialAnalytics(startDate, now),
        this.getPerformanceAnalytics(startDate, now),
      ]);

    return {
      overview,
      transactions,
      users,
      fraud,
      financial,
      performance,
    };
  }

  public getStartDate(range: string, now: Date): Date {
    const days =
      {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365,
      }[range] || 30;

    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }

  public async getOverviewAnalytics(startDate: Date, endDate: Date) {
    const [
      totalUsers,
      activeUsers,
      totalTransactions,
      totalVolume,
      todayTransactions,
      todayVolume,
      successfulTransactions,
      monthlyTransactions,
      monthlyVolume,
    ] = await Promise.all([
      prisma.user.count(),
      this.getActiveUsers(startDate, endDate),
      prisma.transaction.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.transaction.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: "COMPLETED",
        },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.transaction.aggregate({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: "COMPLETED",
        },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: {
          createdAt: { gte: startDate },
          status: "COMPLETED",
        },
      }),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.transaction.aggregate({
        where: {
          createdAt: {
            gte: new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
          status: "COMPLETED",
        },
        _sum: { amount: true },
      }),
    ]);

    const previousMonthStart = new Date(
      endDate.getTime() - 60 * 24 * 60 * 60 * 1000
    );
    const previousMonthEnd = new Date(
      endDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    const [previousMonthTransactions, previousMonthVolume] = await Promise.all([
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: previousMonthEnd,
          },
        },
      }),
      prisma.transaction.aggregate({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: previousMonthEnd,
          },
          status: "COMPLETED",
        },
        _sum: { amount: true },
      }),
    ]);

    const monthlyGrowth =
      previousMonthTransactions > 0
        ? ((monthlyTransactions - previousMonthTransactions) /
            previousMonthTransactions) *
          100
        : 0;

    const successRate =
      totalTransactions > 0
        ? (successfulTransactions / totalTransactions) * 100
        : 0;

    return {
      totalUsers,
      activeUsers,
      totalTransactions,
      totalVolume: Number(totalVolume._sum.amount || 0),
      todayTransactions,
      todayVolume: Number(todayVolume._sum.amount || 0),
      monthlyGrowth,
      successRate,
    };
  }

  public async getTransactionAnalytics(startDate: Date, endDate: Date) {
    // Daily transaction data
    const dailyData = await this.getDailyTransactionData(startDate, endDate);

    // Payment method breakdown
    const paymentMethods = await prisma.transaction.groupBy({
      by: ["method"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { method: true },
      _sum: { amount: true },
    });

    const totalTxCount = paymentMethods.reduce(
      (sum: any, pm: any) => sum + pm._count.method,
      0
    );
    const paymentMethodBreakdown = paymentMethods.map((pm: any) => ({
      method: pm.method,
      count: pm._count.method,
      volume: Number(pm._sum.amount || 0),
      percentage:
        totalTxCount > 0 ? (pm._count.method / totalTxCount) * 100 : 0,
    }));

    // Status breakdown
    const statusBreakdown = await prisma.transaction.groupBy({
      by: ["status"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { status: true },
    });

    const statusBreakdownData = statusBreakdown.map((sb: any) => ({
      status: sb.status,
      count: sb._count.status,
      percentage:
        totalTxCount > 0 ? (sb._count.status / totalTxCount) * 100 : 0,
    }));

    // Risk distribution
    const riskDistribution = await prisma.fraudDetectionLog.groupBy({
      by: ["riskLevel"],
      where: {
        timestamp: { gte: startDate },
      },
      _count: { riskLevel: true },
    });

    const totalRiskCount = riskDistribution.reduce(
      (sum: any, rd: any) => sum + rd._count.riskLevel,
      0
    );
    const riskDistributionData = riskDistribution.map((rd: any) => ({
      level: rd.riskLevel,
      count: rd._count.riskLevel,
      percentage:
        totalRiskCount > 0 ? (rd._count.riskLevel / totalRiskCount) * 100 : 0,
    }));

    return {
      dailyData,
      paymentMethods: paymentMethodBreakdown,
      statusBreakdown: statusBreakdownData,
      riskDistribution: riskDistributionData,
    };
  }

  private async getDailyTransactionData(startDate: Date, endDate: Date) {
    const dailyData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const [dayTransactions, dayVolume, daySuccessful] = await Promise.all([
        prisma.transaction.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        }),
        prisma.transaction.aggregate({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
            status: "COMPLETED",
          },
          _sum: { amount: true },
        }),
        prisma.transaction.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
            status: "COMPLETED",
          },
        }),
      ]);

      dailyData.push({
        date: dayStart.toISOString().split("T")[0],
        count: dayTransactions,
        volume: Number(dayVolume._sum.amount || 0),
        successRate:
          dayTransactions > 0 ? (daySuccessful / dayTransactions) * 100 : 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyData;
  }

  public async getUserAnalytics(startDate: Date, endDate: Date) {
    // New users over time
    const newUsers = await this.getNewUsersData(startDate, endDate);

    // User activity
    const userActivity = await this.getUserActivityData(startDate, endDate);

    // Top users
    const topUsers = await prisma.transaction.groupBy({
      by: ["userId"],
      where: {
        createdAt: { gte: startDate },
        status: "COMPLETED",
      },
      _count: { userId: true },
      _sum: { amount: true },
      orderBy: {
        _sum: { amount: "desc" },
      },
      take: 10,
    });

    const userIds = topUsers.map((u: any) => u.userId);
    const userDetails = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true },
    });

    const topUsersData = topUsers.map((user: any) => ({
      userId: user.userId,
      email: userDetails.find((u) => u.id === user.userId)?.email || "Unknown",
      transactionCount: user._count.userId,
      totalVolume: Number(user._sum.amount || 0),
    }));

    // User retention (simplified calculation)
    const userRetention = await this.calculateUserRetention();

    return {
      newUsers,
      userActivity,
      topUsers: topUsersData,
      userRetention,
    };
  }

  private async getNewUsersData(startDate: Date, endDate: Date) {
    const newUsers = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayNewUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      newUsers.push({
        date: dayStart.toISOString().split("T")[0],
        count: dayNewUsers,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return newUsers;
  }

  private async getUserActivityData(startDate: Date, endDate: Date) {
    const userActivity = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const [activeUsers, totalUsers] = await Promise.all([
        prisma.userActivityLog
          .groupBy({
            by: ["userId"],
            where: {
              timestamp: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
            _count: { userId: true },
          })
          .then((logs: any) => logs.length),
        prisma.user.count({
          where: {
            createdAt: {
              lte: dayEnd,
            },
          },
        }),
      ]);

      userActivity.push({
        date: dayStart.toISOString().split("T")[0],
        activeUsers,
        totalUsers,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return userActivity;
  }

  private async calculateUserRetention() {
    const now = new Date();
    const day1Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const day7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const day30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [day1Users, day7Users, day30Users] = await Promise.all([
      prisma.user.count({ where: { createdAt: { lte: day1Ago } } }),
      prisma.user.count({ where: { createdAt: { lte: day7Ago } } }),
      prisma.user.count({ where: { createdAt: { lte: day30Ago } } }),
    ]);

    const [day1Active, day7Active, day30Active] = await Promise.all([
      this.getActiveUsers(day1Ago, now),
      this.getActiveUsers(day7Ago, now),
      this.getActiveUsers(day30Ago, now),
    ]);

    return {
      day1: day1Users > 0 ? (day1Active / day1Users) * 100 : 0,
      day7: day7Users > 0 ? (day7Active / day7Users) * 100 : 0,
      day30: day30Users > 0 ? (day30Active / day30Users) * 100 : 0,
    };
  }

  private async getActiveUsers(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const activeUsers = await prisma.userActivityLog.groupBy({
      by: ["userId"],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: { userId: true },
    });

    return activeUsers.length;
  }

  public async getFraudAnalytics(startDate: Date, endDate: Date) {
    // Fraud trends
    const fraudTrends = await this.getFraudTrends(startDate, endDate);

    // Top risk factors
    const topRiskFactors = await this.getTopRiskFactors(startDate, endDate);

    // Geographic risks
    const geographicRisks = await this.getGeographicRisks(startDate, endDate);

    // Device analysis
    const deviceAnalysis = await this.getDeviceAnalysis(startDate, endDate);

    return {
      fraudTrends,
      topRiskFactors,
      geographicRisks,
      deviceAnalysis,
    };
  }

  private async getFraudTrends(startDate: Date, endDate: Date) {
    const fraudTrends = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const [highRisk, critical, blocked] = await Promise.all([
        prisma.fraudDetectionLog.count({
          where: {
            timestamp: {
              gte: dayStart,
              lte: dayEnd,
            },
            riskLevel: "HIGH",
          },
        }),
        prisma.fraudDetectionLog.count({
          where: {
            timestamp: {
              gte: dayStart,
              lte: dayEnd,
            },
            riskLevel: "CRITICAL",
          },
        }),
        prisma.transaction.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
            status: "FAILED" as any,
          },
        }),
      ]);

      fraudTrends.push({
        date: dayStart.toISOString().split("T")[0],
        highRisk,
        critical,
        blocked,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return fraudTrends;
  }

  private async getTopRiskFactors(startDate: Date, endDate: Date) {
    // This would analyze reasons from fraud detection logs
    // For now, return mock data
    return [
      { factor: "Large Transaction Amount", count: 45, percentage: 35.2 },
      { factor: "Suspicious IP Address", count: 32, percentage: 25.0 },
      { factor: "Rapid Transactions", count: 28, percentage: 21.9 },
      { factor: "Device Fingerprint", count: 15, percentage: 11.7 },
      { factor: "Geographic Anomaly", count: 8, percentage: 6.2 },
    ];
  }

  private async getGeographicRisks(startDate: Date, endDate: Date) {
    // Mock geographic risk data
    return [
      { country: "US", riskCount: 120, riskScore: 15.2 },
      { country: "CN", riskCount: 89, riskScore: 45.8 },
      { country: "RU", riskCount: 67, riskScore: 52.3 },
      { country: "NG", riskCount: 45, riskScore: 38.9 },
      { country: "IN", riskCount: 34, riskScore: 22.1 },
    ];
  }

  private async getDeviceAnalysis(startDate: Date, endDate: Date) {
    // Mock device analysis data
    return [
      { deviceType: "Desktop", riskCount: 156, totalCount: 2340 },
      { deviceType: "Mobile", riskCount: 89, totalCount: 1876 },
      { deviceType: "Tablet", riskCount: 23, totalCount: 456 },
      { deviceType: "Bot/Script", riskCount: 67, totalCount: 78 },
    ];
  }

  public async getFinancialAnalytics(startDate: Date, endDate: Date) {
    // Revenue data (mock for now)
    const revenue = await this.getRevenueData(startDate, endDate);

    // Processing costs (mock)
    const processingCosts = await this.getProcessingCosts(startDate, endDate);

    // Profit margins
    const profitMargins = revenue.map((rev, index) => ({
      date: rev.date,
      margin: processingCosts[index]
        ? ((Number(rev.amount) - Number(processingCosts[index].amount)) /
            Number(rev.amount)) *
          100
        : 0,
    }));

    // Currency breakdown
    const currencyBreakdown = await prisma.transaction.groupBy({
      by: ["currency"],
      where: {
        createdAt: { gte: startDate },
        status: "COMPLETED",
      },
      _sum: { amount: true },
    });

    const totalVolume = currencyBreakdown.reduce(
      (sum: any, cb: any) => sum + Number(cb._sum.amount || 0),
      0
    );
    const currencyData = currencyBreakdown.map((cb: any) => ({
      currency: cb.currency,
      volume: Number(cb._sum.amount || 0),
      percentage:
        totalVolume > 0 ? (Number(cb._sum.amount || 0) / totalVolume) * 100 : 0,
    }));

    return {
      revenue,
      processingCosts,
      profitMargins,
      currencyBreakdown: currencyData,
    };
  }

  private async getRevenueData(startDate: Date, endDate: Date) {
    const revenue = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayRevenue = await prisma.transaction.aggregate({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
          status: "COMPLETED",
        },
        _sum: { amount: true },
      });

      revenue.push({
        date: dayStart.toISOString().split("T")[0],
        amount: Number(dayRevenue._sum.amount || 0),
        fees: Number(dayRevenue._sum.amount || 0) * 0.029, // 2.9% fee
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return revenue;
  }

  private async getProcessingCosts(startDate: Date, endDate: Date) {
    // Mock processing costs data
    const costs = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      costs.push({
        date: currentDate.toISOString().split("T")[0],
        amount: Math.random() * 1000 + 500, // Mock processing costs
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return costs;
  }

  public async getPerformanceAnalytics(startDate: Date, endDate: Date) {
    // Mock performance data
    const apiResponseTimes = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      apiResponseTimes.push({
        timestamp: currentDate.toISOString(),
        avgResponseTime: Math.random() * 200 + 50,
        p95ResponseTime: Math.random() * 500 + 100,
        errorRate: Math.random() * 5,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const systemHealth = {
      uptime: 99.9,
      errorRate: 0.1,
      avgResponseTime: 125,
      activeConnections: 156,
    };

    const databaseStats = {
      totalQueries: 1523478,
      avgQueryTime: 45.2,
      slowQueries: 23,
    };

    return {
      apiResponseTimes,
      systemHealth,
      databaseStats,
    };
  }

  // Real-time dashboard data
  async getRealTimeMetrics() {
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const [recentTransactions, recentAlerts, activeUsers, systemLoad] =
      await Promise.all([
        prisma.transaction.count({
          where: {
            createdAt: { gte: last5Minutes },
          },
        }),
        prisma.fraudDetectionLog.count({
          where: {
            timestamp: { gte: lastHour },
          },
        }),
        this.getActiveUsers(last5Minutes, now),
        this.getSystemLoad(),
      ]);

    return {
      recentTransactions,
      recentAlerts,
      activeUsers,
      systemLoad,
      timestamp: now.toISOString(),
    };
  }

  private async getSystemLoad() {
    // Mock system load data
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100,
    };
  }
}

export const adminAnalytics = new AdminAnalyticsService();
