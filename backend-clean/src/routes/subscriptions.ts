import { Router, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many subscription requests, please try again later",
});

interface CreateSubscriptionBody {
  customerId: string;
  planId: string;
  paymentMethod: string;
}

router.post("/", limiter, async (req: Request, res: Response) => {
  try {
    const { customerId, planId, paymentMethod }: CreateSubscriptionBody = req.body;

    if (!customerId || !planId || !paymentMethod) {
      return res.status(400).json({
        error: "Missing required fields: customerId, planId, paymentMethod",
      });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + plan.billingCycle);

    const subscription = await prisma.subscription.create({
      data: {
        customerId,
        planId,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
      include: { plan: true, customer: true },
    });

    logger.info(`Subscription created: ${subscription.id}`);

    res.status(201).json({
      success: true,
      subscription,
      message: `Subscription created for ${customer.email}`,
    });
  } catch (error) {
    logger.error("Subscription creation error", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true, customer: true },
    });

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.json(subscription);
  } catch (error) {
    logger.error("Subscription fetch error", error);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

export default router;
