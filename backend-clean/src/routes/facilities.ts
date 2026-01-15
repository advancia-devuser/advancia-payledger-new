import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * Get all facilities for the authenticated user
 */
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const facilities = await prisma.medicalFacility.findMany({
      where: {
        // Add user-specific filtering if needed
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        contactPerson: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Calculate revenue for each facility (from bookings)
    const facilitiesWithRevenue = await Promise.all(
      facilities.map(async (facility) => {
        const bookings = await prisma.medicalBooking.findMany({
          where: {
            facilityId: facility.id,
            status: "COMPLETED",
          },
          select: {
            totalCost: true,
          },
        });

        const revenue = bookings.reduce(
          (sum, booking) => sum + (booking.totalCost || 0),
          0
        );

        return {
          ...facility,
          revenue,
        };
      })
    );

    res.json({
      facilities: facilitiesWithRevenue,
      total: facilitiesWithRevenue.length,
    });
  } catch (error: any) {
    console.error("Get facilities error:", error);
    res.status(500).json({ error: "Failed to fetch facilities" });
  }
});

/**
 * Get single facility by ID
 */
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const facility = await prisma.medicalFacility.findUnique({
      where: { id },
      include: {
        bookings: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!facility) {
      res.status(404).json({ error: "Facility not found" });
      return;
    }

    // Calculate total revenue
    const revenue = facility.bookings.reduce(
      (sum, booking) => sum + (booking.totalCost || 0),
      0
    );

    res.json({
      facility: {
        ...facility,
        revenue,
      },
    });
  } catch (error: any) {
    console.error("Get facility error:", error);
    res.status(500).json({ error: "Failed to fetch facility" });
  }
});

/**
 * Create new facility
 */
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      contactPerson,
      email,
      phone,
      description,
    } = req.body;

    // Validate required fields
    if (!name || !address || !city || !state) {
      res.status(400).json({
        error: "Name, address, city, and state are required",
      });
      return;
    }

    const facility = await prisma.medicalFacility.create({
      data: {
        name,
        address,
        city,
        state,
        zipCode: zipCode || "",
        contactPerson: contactPerson || "",
        email: email || "",
        phone: phone || "",
        description: description || "",
        status: "ACTIVE",
        isActive: true,
      },
    });

    res.status(201).json({
      message: "Facility created successfully",
      facility,
    });
  } catch (error: any) {
    console.error("Create facility error:", error);
    res.status(500).json({ error: "Failed to create facility" });
  }
});

/**
 * Update facility
 */
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      city,
      state,
      zipCode,
      contactPerson,
      email,
      phone,
      description,
      status,
    } = req.body;

    const facility = await prisma.medicalFacility.findUnique({
      where: { id },
    });

    if (!facility) {
      res.status(404).json({ error: "Facility not found" });
      return;
    }

    const updatedFacility = await prisma.medicalFacility.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(contactPerson !== undefined && { contactPerson }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
    });

    res.json({
      message: "Facility updated successfully",
      facility: updatedFacility,
    });
  } catch (error: any) {
    console.error("Update facility error:", error);
    res.status(500).json({ error: "Failed to update facility" });
  }
});

/**
 * Delete facility (soft delete)
 */
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const facility = await prisma.medicalFacility.findUnique({
      where: { id },
    });

    if (!facility) {
      res.status(404).json({ error: "Facility not found" });
      return;
    }

    // Soft delete - mark as inactive
    await prisma.medicalFacility.update({
      where: { id },
      data: {
        isActive: false,
        status: "INACTIVE",
      },
    });

    res.json({
      message: "Facility deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete facility error:", error);
    res.status(500).json({ error: "Failed to delete facility" });
  }
});

/**
 * Get facility statistics
 */
router.get("/:id/stats", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const facility = await prisma.medicalFacility.findUnique({
      where: { id },
    });

    if (!facility) {
      res.status(404).json({ error: "Facility not found" });
      return;
    }

    const [totalBookings, completedBookings, pendingBookings, revenue] =
      await Promise.all([
        prisma.medicalBooking.count({
          where: { facilityId: id },
        }),
        prisma.medicalBooking.count({
          where: { facilityId: id, status: "COMPLETED" },
        }),
        prisma.medicalBooking.count({
          where: { facilityId: id, status: "PENDING" },
        }),
        prisma.medicalBooking.aggregate({
          where: { facilityId: id, status: "COMPLETED" },
          _sum: { totalCost: true },
        }),
      ]);

    res.json({
      stats: {
        totalBookings,
        completedBookings,
        pendingBookings,
        totalRevenue: revenue._sum.totalCost || 0,
        averageBookingValue:
          completedBookings > 0
            ? (revenue._sum.totalCost || 0) / completedBookings
            : 0,
      },
    });
  } catch (error: any) {
    console.error("Get facility stats error:", error);
    res.status(500).json({ error: "Failed to fetch facility statistics" });
  }
});

export default router;
