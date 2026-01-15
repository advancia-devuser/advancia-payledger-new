import { Router } from "express";
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth";
import { activityLogger } from "../../middleware/activityLogger";
import { prisma } from "../../lib/prisma";

const router = Router();

// Get activity logs for a specific user
router.get(
  "/activity/:userId",
  authenticate,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50, action } = req.query;

      const where: any = { userId };
      if (action && typeof action === "string") {
        where.action = { contains: action, mode: "insensitive" };
      }

      const logs = await prisma.userActivityLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
      });

      const total = await prisma.userActivityLog.count({ where });

      res.json({
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  }
);

// Get activity logs for current user
router.get("/my-activity", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { page = 1, limit = 50, action } = req.query;

    const where: any = { userId };
    if (action && typeof action === "string") {
      where.action = { contains: action, mode: "insensitive" };
    }

    const logs = await prisma.userActivityLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    const total = await prisma.userActivityLog.count({ where });

    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching user activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// Get system-wide activity summary (admin only)
router.get(
  "/activity-summary",
  authenticate,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const { days = 7 } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(days));

      // Total activities
      const totalActivities = await prisma.userActivityLog.count({
        where: { timestamp: { gte: startDate } },
      });

      // Activities by action type
      const activitiesByAction = await prisma.userActivityLog.groupBy({
        by: ["action"],
        where: { timestamp: { gte: startDate } },
        _count: { action: true },
        orderBy: { _count: { action: "desc" } },
        take: 10,
      });

      // Failed activities
      const failedActivities = await prisma.userActivityLog.count({
        where: {
          timestamp: { gte: startDate },
          success: false,
        },
      });

      // Average response time
      const avgResponseTime = await prisma.userActivityLog.aggregate({
        where: {
          timestamp: { gte: startDate },
          responseTime: { not: null },
        },
        _avg: { responseTime: true },
      });

      // Most active users
      const mostActiveUsers = await prisma.userActivityLog.groupBy({
        by: ["userId"],
        where: { timestamp: { gte: startDate } },
        _count: { userId: true },
        orderBy: { _count: { userId: "desc" } },
        take: 10,
      });

      // Get user details for most active users
      const userIds = mostActiveUsers.map((u: any) => u.userId);
      const userDetails = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, email: true, firstName: true, lastName: true },
      });

      const mostActiveUsersWithDetails = mostActiveUsers.map((user: any) => ({
        ...user,
        user: userDetails.find((u: any) => u.id === user.userId),
      }));

      res.json({
        summary: {
          totalActivities,
          failedActivities,
          successRate:
            totalActivities > 0
              ? (
                  ((totalActivities - failedActivities) / totalActivities) *
                  100
                ).toFixed(2)
              : 0,
          avgResponseTime: avgResponseTime._avg.responseTime || 0,
        },
        activitiesByAction: activitiesByAction.map((item: any) => ({
          action: item.action,
          count: item._count.action,
        })),
        mostActiveUsers: mostActiveUsersWithDetails,
      });
    } catch (error) {
      console.error("Error fetching activity summary:", error);
      res.status(500).json({ error: "Failed to fetch activity summary" });
    }
  }
);

export default router;
