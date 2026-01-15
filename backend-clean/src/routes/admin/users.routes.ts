import { Router, Response } from "express";
import prisma from "../../lib/prisma";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { requireRole } from "../../middleware/auth";
import { emailService } from "../../services/emailService";

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireRole("ADMIN"));

/**
 * Get all users with filtering
 */
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { status, role, search, page = "1", limit = "20" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: "insensitive" } },
        { firstName: { contains: search as string, mode: "insensitive" } },
        { lastName: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          status: true,
          role: true,
          emailVerified: true,
          kycStatus: true,
          registeredAt: true,
          approvedAt: true,
          approvedBy: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * Get single user details
 */
router.get("/:userId", async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        cards: true,
        transactions: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Remove sensitive data
    const { password: _, emailVerificationToken: __, ...userWithoutSensitive } = user;

    res.json({ user: userWithoutSensitive });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * Approve user
 */
router.post("/:userId/approve", async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const adminId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.status !== "PENDING_APPROVAL") {
      res.status(400).json({ error: "User is not pending approval" });
      return;
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: "ACTIVE",
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: adminId!,
        adminEmail: req.user?.email || "unknown",
        action: "APPROVE_USER",
        targetId: userId,
        targetType: "user",
        details: {
          userEmail: user.email,
          previousStatus: "PENDING_APPROVAL",
          newStatus: "ACTIVE",
        },
      },
    });

    // Send approval email
    try {
      await emailService.sendApprovalEmail(user.email, user.firstName, true);
      console.log(`[ADMIN] Approval email sent to ${user.email}`);
    } catch (emailError) {
      console.error("[ADMIN] Failed to send approval email:", emailError);
    }

    const { password: _, emailVerificationToken: __, ...userWithoutSensitive } = updatedUser;

    res.json({
      message: "User approved successfully",
      user: userWithoutSensitive,
    });
  } catch (error: any) {
    console.error("Approve user error:", error);
    res.status(500).json({ error: "Failed to approve user" });
  }
});

/**
 * Reject user
 */
router.post("/:userId/reject", async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user?.userId;

    if (!reason) {
      res.status(400).json({ error: "Rejection reason is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.status !== "PENDING_APPROVAL") {
      res.status(400).json({ error: "User is not pending approval" });
      return;
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: "REJECTED",
        rejectedBy: adminId,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: adminId!,
        adminEmail: req.user?.email || "unknown",
        action: "REJECT_USER",
        targetId: userId,
        targetType: "user",
        details: {
          userEmail: user.email,
          previousStatus: "PENDING_APPROVAL",
          newStatus: "REJECTED",
          reason,
        },
      },
    });

    // Send rejection email
    try {
      await emailService.sendApprovalEmail(user.email, user.firstName, false);
      console.log(`[ADMIN] Rejection email sent to ${user.email}`);
    } catch (emailError) {
      console.error("[ADMIN] Failed to send rejection email:", emailError);
    }

    const { password: _, emailVerificationToken: __, ...userWithoutSensitive } = updatedUser;

    res.json({
      message: "User rejected successfully",
      user: userWithoutSensitive,
    });
  } catch (error: any) {
    console.error("Reject user error:", error);
    res.status(500).json({ error: "Failed to reject user" });
  }
});

/**
 * Suspend user
 */
router.post("/:userId/suspend", async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: "SUSPENDED",
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: adminId!,
        adminEmail: req.user?.email || "unknown",
        action: "SUSPEND_USER",
        targetId: userId,
        targetType: "user",
        details: {
          userEmail: user.email,
          previousStatus: user.status,
          newStatus: "SUSPENDED",
          reason: reason || "No reason provided",
        },
      },
    });

    const { password: _, emailVerificationToken: __, ...userWithoutSensitive } = updatedUser;

    res.json({
      message: "User suspended successfully",
      user: userWithoutSensitive,
    });
  } catch (error: any) {
    console.error("Suspend user error:", error);
    res.status(500).json({ error: "Failed to suspend user" });
  }
});

/**
 * Activate user
 */
router.post("/:userId/activate", async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const adminId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: "ACTIVE",
      },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: adminId!,
        adminEmail: req.user?.email || "unknown",
        action: "ACTIVATE_USER",
        targetId: userId,
        targetType: "user",
        details: {
          userEmail: user.email,
          previousStatus: user.status,
          newStatus: "ACTIVE",
        },
      },
    });

    const { password: _, emailVerificationToken: __, ...userWithoutSensitive } = updatedUser;

    res.json({
      message: "User activated successfully",
      user: userWithoutSensitive,
    });
  } catch (error: any) {
    console.error("Activate user error:", error);
    res.status(500).json({ error: "Failed to activate user" });
  }
});

/**
 * Get user statistics
 */
router.get("/stats/overview", async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      pendingApproval,
      activeUsers,
      suspendedUsers,
      rejectedUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
      prisma.user.count({ where: { status: "REJECTED" } }),
    ]);

    res.json({
      totalUsers,
      pendingApproval,
      activeUsers,
      suspendedUsers,
      rejectedUsers,
    });
  } catch (error: any) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
