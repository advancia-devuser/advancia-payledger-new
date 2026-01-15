import { Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

/**
 * GET /api/dashboard/stats
 * Get authenticated user's dashboard statistics
 * SECURITY: Only returns data for the authenticated user
 */
router.get("/stats", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    // Fetch user data - ONLY for authenticated user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
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

    // Return user's own data
    res.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      balance: Number(user.wallet?.balance || 0),
      status: user.status,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

/**
 * GET /api/dashboard/transactions
 * Get authenticated user's transactions
 * SECURITY: Only returns transactions for the authenticated user
 */
router.get("/transactions", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Fetch transactions - ONLY for authenticated user
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId, // CRITICAL: User isolation
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        type: true,
        amount: true,
        currency: true,
        status: true,
        method: true,
        metadata: true,
        createdAt: true,
      },
    });

    // Count total transactions for pagination
    const totalCount = await prisma.transaction.count({
      where: {
        userId: userId, // CRITICAL: User isolation
      },
    });

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Dashboard transactions error:", error);
    res.status(500).json({ error: "Failed to load transactions" });
  }
});

/**
 * GET /api/dashboard/admin/stats
 * Get admin dashboard statistics
 * SECURITY: Requires ADMIN or SUPERADMIN role
 */
router.get("/admin/stats", authenticate, async (req: AuthRequest, res) => {
  try {
    const userRole = req.user!.role;

    // Check if user is admin
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      res.status(403).json({ error: "Access denied. Admin role required." });
      return;
    }

    // Get platform-wide statistics
    const [
      totalUsers,
      pendingApprovals,
      totalTransactions,
      activeUsers,
      blockedUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.transaction.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
    ]);

    // Calculate total revenue
    const revenueData = await prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
        type: "DEPOSIT",
      },
      _sum: {
        amount: true,
      },
    });

    const totalRevenue = Number(revenueData._sum.amount || 0);

    res.json({
      totalUsers,
      pendingApprovals,
      totalTransactions,
      totalRevenue,
      activeUsers,
      blockedUsers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

/**
 * GET /api/dashboard/admin/activity
 * Get recent activity logs for admin
 * SECURITY: Requires ADMIN or SUPERADMIN role
 */
router.get("/admin/activity", authenticate, async (req: AuthRequest, res) => {
  try {
    const userRole = req.user!.role;

    // Check if user is admin
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      res.status(403).json({ error: "Access denied. Admin role required." });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Fetch recent activity logs
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const totalCount = await prisma.auditLog.count();

    res.json({
      logs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Admin activity error:", error);
    res.status(500).json({ error: "Failed to load activity logs" });
  }
});

/**
 * GET /api/dashboard/withdrawal-history
 * Get authenticated user's withdrawal history
 * SECURITY: Only returns withdrawals for the authenticated user
 */
router.get(
  "/withdrawal-history",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Fetch withdrawal transactions - ONLY for authenticated user
      const withdrawals = await prisma.transaction.findMany({
        where: {
          userId: userId, // CRITICAL: User isolation
          type: "WITHDRAWAL",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      });

      const totalCount = await prisma.transaction.count({
        where: {
          userId: userId, // CRITICAL: User isolation
          type: "WITHDRAWAL",
        },
      });

      res.json({
        withdrawals,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      console.error("Withdrawal history error:", error);
      res.status(500).json({ error: "Failed to load withdrawal history" });
    }
  }
);

/**
 * GET /api/dashboard/medbeds-bookings
 * Get authenticated user's MedBed bookings
 * SECURITY: Only returns bookings for the authenticated user
 */
router.get("/medbeds-bookings", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    // Check if medbeds_bookings table exists
    try {
      const bookings = await prisma.medBedBooking.findMany({
        where: {
          userId: userId, // CRITICAL: User isolation
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          chamber: {
            select: {
              name: true,
              description: true,
            },
          },
        },
      });

      res.json({ bookings });
    } catch (tableError: any) {
      // Table doesn't exist yet
      if (
        tableError.code === "P2021" ||
        tableError.message?.includes("does not exist")
      ) {
        res.json({ bookings: [] });
        return;
      }
      throw tableError;
    }
  } catch (error) {
    console.error("MedBeds bookings error:", error);
    res.status(500).json({ error: "Failed to load MedBed bookings" });
  }
});

export default router;
