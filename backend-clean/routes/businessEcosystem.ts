import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const OpportunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  estimatedRevenue: z.number(),
  actualRevenue: z.number().default(0),
  status: z.enum(["not-started", "in-progress", "completed", "on-hold"]),
  progress: z.number().min(0).max(100),
  timeframe: z.string(),
  difficulty: z.enum(["low", "medium", "high"]),
  dependencies: z.array(z.string()),
  synergy: z.string(),
  nextStep: z.string(),
  notes: z.string().optional(),
  milestones: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean().default(false),
        dueDate: z.string().optional(),
        completedAt: z.string().optional(),
      })
    )
    .optional(),
});

const BusinessEcosystemSchema = z.object({
  userId: z.string(),
  opportunities: z.record(OpportunitySchema),
  roadmapPhases: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: z.enum(["planning", "active", "completed", "delayed"]),
      goals: z.array(z.string()),
      kpis: z.array(z.string()),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      progress: z.number().min(0).max(100).default(0),
    })
  ),
  crossPollination: z.array(
    z.object({
      title: z.string(),
      items: z.array(z.string()),
      impact: z.enum(["low", "medium", "high"]),
      estimatedLift: z.string(),
      status: z
        .enum(["planned", "in-progress", "completed"])
        .default("planned"),
    })
  ),
  metrics: z
    .object({
      totalPipeline: z.number(),
      totalActual: z.number(),
      averageProgress: z.number(),
      completionRate: z.number(),
    })
    .optional(),
});

// GET /api/business-ecosystem - Retrieve user's business ecosystem data
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.id || "default"; // Use authenticated user ID or default

    let ecosystem = await prisma.businessEcosystem.findUnique({
      where: { userId },
      include: {
        opportunities: true,
        roadmapPhases: true,
        crossPollination: true,
      },
    });

    // If no data exists, return default structure
    if (!ecosystem) {
      ecosystem = {
        userId,
        opportunities: {},
        roadmapPhases: [],
        crossPollination: [],
        metrics: {
          totalPipeline: 0,
          totalActual: 0,
          averageProgress: 0,
          completionRate: 0,
        },
      };
    }

    res.json({
      success: true,
      data: ecosystem,
    });
  } catch (error) {
    console.error("Error fetching business ecosystem:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch business ecosystem data",
    });
  }
});

// POST /api/business-ecosystem - Save or update business ecosystem data
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id || "default";
    const validatedData = BusinessEcosystemSchema.parse({
      ...req.body,
      userId,
    });

    // Upsert business ecosystem data
    const ecosystem = await prisma.businessEcosystem.upsert({
      where: { userId },
      update: {
        opportunities: validatedData.opportunities,
        metrics: validatedData.metrics || {
          totalPipeline: Object.values(validatedData.opportunities).reduce(
            (sum, opp) => sum + opp.estimatedRevenue,
            0
          ),
          totalActual: Object.values(validatedData.opportunities).reduce(
            (sum, opp) => sum + opp.actualRevenue,
            0
          ),
          averageProgress:
            Object.values(validatedData.opportunities).reduce(
              (sum, opp) => sum + opp.progress,
              0
            ) / Object.values(validatedData.opportunities).length || 0,
          completionRate:
            (Object.values(validatedData.opportunities).filter(
              (opp) => opp.status === "completed"
            ).length /
              Object.values(validatedData.opportunities).length) *
              100 || 0,
        },
      },
      create: {
        userId,
        opportunities: validatedData.opportunities,
        metrics: validatedData.metrics || {
          totalPipeline: Object.values(validatedData.opportunities).reduce(
            (sum, opp) => sum + opp.estimatedRevenue,
            0
          ),
          totalActual: Object.values(validatedData.opportunities).reduce(
            (sum, opp) => sum + opp.actualRevenue,
            0
          ),
          averageProgress:
            Object.values(validatedData.opportunities).reduce(
              (sum, opp) => sum + opp.progress,
              0
            ) / Object.values(validatedData.opportunities).length || 0,
          completionRate:
            (Object.values(validatedData.opportunities).filter(
              (opp) => opp.status === "completed"
            ).length /
              Object.values(validatedData.opportunities).length) *
              100 || 0,
        },
      },
    });

    // Update roadmap phases if provided
    if (validatedData.roadmapPhases.length > 0) {
      await prisma.roadmapPhase.deleteMany({ where: { userId } });
      await prisma.roadmapPhase.createMany({
        data: validatedData.roadmapPhases.map((phase) => ({
          ...phase,
          userId,
        })),
      });
    }

    // Update cross-pollination strategies if provided
    if (validatedData.crossPollination.length > 0) {
      await prisma.crossPollination.deleteMany({ where: { userId } });
      await prisma.crossPollination.createMany({
        data: validatedData.crossPollination.map((strategy) => ({
          ...strategy,
          userId,
        })),
      });
    }

    res.json({
      success: true,
      data: ecosystem,
      message: "Business ecosystem data saved successfully",
    });
  } catch (error) {
    console.error("Error saving business ecosystem:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to save business ecosystem data",
    });
  }
});

// PUT /api/business-ecosystem/opportunities/:id - Update specific opportunity
router.put("/opportunities/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || "default";
    const opportunityData = OpportunitySchema.parse({ ...req.body, id });

    // Get current ecosystem data
    let ecosystem = await prisma.businessEcosystem.findUnique({
      where: { userId },
    });

    if (!ecosystem) {
      return res.status(404).json({
        success: false,
        error: "Business ecosystem not found",
      });
    }

    // Update opportunities object
    const updatedOpportunities = {
      ...((ecosystem.opportunities as any) || {}),
      [id]: opportunityData,
    };

    // Recalculate metrics
    const opportunities = Object.values(updatedOpportunities);
    const metrics = {
      totalPipeline: opportunities.reduce(
        (sum, opp) => sum + opp.estimatedRevenue,
        0
      ),
      totalActual: opportunities.reduce(
        (sum, opp) => sum + opp.actualRevenue,
        0
      ),
      averageProgress:
        opportunities.reduce((sum, opp) => sum + opp.progress, 0) /
          opportunities.length || 0,
      completionRate:
        (opportunities.filter((opp) => opp.status === "completed").length /
          opportunities.length) *
          100 || 0,
    };

    // Update ecosystem
    const updated = await prisma.businessEcosystem.update({
      where: { userId },
      data: {
        opportunities: updatedOpportunities,
        metrics,
      },
    });

    res.json({
      success: true,
      data: updated,
      message: "Opportunity updated successfully",
    });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update opportunity",
    });
  }
});

// GET /api/business-ecosystem/metrics - Get calculated metrics
router.get("/metrics", async (req, res) => {
  try {
    const userId = req.user?.id || "default";

    const ecosystem = await prisma.businessEcosystem.findUnique({
      where: { userId },
    });

    if (!ecosystem) {
      return res.json({
        success: true,
        data: {
          totalPipeline: 0,
          totalActual: 0,
          averageProgress: 0,
          completionRate: 0,
          opportunitiesByStatus: {},
          revenueByHub: {},
          projectedGrowth: [],
        },
      });
    }

    const opportunities = Object.values((ecosystem.opportunities as any) || []);

    // Calculate advanced metrics
    const opportunitiesByStatus = opportunities.reduce((acc, opp) => {
      acc[opp.status] = (acc[opp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const revenueByHub = opportunities.reduce((acc, opp) => {
      const hub = opp.id.split("-")[0];
      acc[hub] = (acc[hub] || 0) + opp.estimatedRevenue;
      return acc;
    }, {} as Record<string, number>);

    // Project growth over next 12 months
    const projectedGrowth = [];
    const monthlyGrowthRate = 0.15; // 15% monthly growth assumption
    let currentRevenue = ecosystem.metrics?.totalActual || 0;

    for (let i = 1; i <= 12; i++) {
      currentRevenue *= 1 + monthlyGrowthRate;
      projectedGrowth.push({
        month: i,
        projected: Math.round(currentRevenue),
        confidence: Math.max(0.7, 0.95 - i * 0.02), // Decreasing confidence over time
      });
    }

    res.json({
      success: true,
      data: {
        ...ecosystem.metrics,
        opportunitiesByStatus,
        revenueByHub,
        projectedGrowth,
        totalOpportunities: opportunities.length,
        averageTimeframe:
          opportunities.reduce((sum, opp) => {
            const months = parseInt(opp.timeframe.split("-")[1]) || 3;
            return sum + months;
          }, 0) / opportunities.length || 0,
      },
    });
  } catch (error) {
    console.error("Error calculating metrics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate metrics",
    });
  }
});

// POST /api/business-ecosystem/export - Export business plan
router.post("/export", async (req, res) => {
  try {
    const userId = req.user?.id || "default";
    const { format = "json" } = req.body;

    const ecosystem = await prisma.businessEcosystem.findUnique({
      where: { userId },
      include: {
        opportunities: true,
        roadmapPhases: true,
        crossPollination: true,
      },
    });

    if (!ecosystem) {
      return res.status(404).json({
        success: false,
        error: "Business ecosystem not found",
      });
    }

    const exportData = {
      ...ecosystem,
      exportedAt: new Date().toISOString(),
      version: "2.0",
      format,
    };

    if (format === "csv") {
      // Convert to CSV format for opportunities
      const opportunities = Object.values(
        (ecosystem.opportunities as any) || []
      );
      const csvHeaders = [
        "ID",
        "Name",
        "Estimated Revenue",
        "Actual Revenue",
        "Status",
        "Progress",
        "Timeframe",
        "Difficulty",
      ];
      const csvRows = opportunities.map((opp) => [
        opp.id,
        opp.name,
        opp.estimatedRevenue,
        opp.actualRevenue,
        opp.status,
        opp.progress,
        opp.timeframe,
        opp.difficulty,
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map((row) => row.join(","))
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="business-ecosystem-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );
      return res.send(csvContent);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="business-ecosystem-${
        new Date().toISOString().split("T")[0]
      }.json"`
    );
    res.json(exportData);
  } catch (error) {
    console.error("Error exporting business ecosystem:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export business ecosystem",
    });
  }
});

// DELETE /api/business-ecosystem - Reset user's business ecosystem
router.delete("/", async (req, res) => {
  try {
    const userId = req.user?.id || "default";

    await prisma.businessEcosystem.delete({
      where: { userId },
    });

    res.json({
      success: true,
      message: "Business ecosystem reset successfully",
    });
  } catch (error) {
    console.error("Error resetting business ecosystem:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reset business ecosystem",
    });
  }
});

export default router;
