import { Router } from "express";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { prisma } from "../../lib/prisma";

const router = Router();

// Get user preferences
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });

    // If no preferences exist, create default preferences
    if (!preferences) {
      preferences = await prisma.userPreference.create({
        data: {
          userId,
        },
      });
    }

    res.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update user preferences
router.put("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      preferredPaymentMethod,
      currency,
      language,
      timezone,
      emailNotifications,
      smsNotifications,
      pushNotifications,
      twoFactorEnabled,
      biometricEnabled,
      autoBackup,
      darkMode,
    } = req.body;

    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        preferredPaymentMethod,
        currency,
        language,
        timezone,
        emailNotifications,
        smsNotifications,
        pushNotifications,
        twoFactorEnabled,
        biometricEnabled,
        autoBackup,
        darkMode,
      },
      create: {
        userId,
        preferredPaymentMethod,
        currency,
        language,
        timezone,
        emailNotifications,
        smsNotifications,
        pushNotifications,
        twoFactorEnabled,
        biometricEnabled,
        autoBackup,
        darkMode,
      },
    });

    res.json({
      success: true,
      message: "Preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update specific preference
router.patch("/:field", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { field } = req.params;
    const { value } = req.body;

    // Validate field name
    const allowedFields = [
      "preferredPaymentMethod",
      "currency",
      "language",
      "timezone",
      "emailNotifications",
      "smsNotifications",
      "pushNotifications",
      "twoFactorEnabled",
      "biometricEnabled",
      "autoBackup",
      "darkMode",
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        error: "Invalid field name",
      });
    }

    const preferences = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        [field]: value,
      },
      create: {
        userId,
        [field]: value,
      },
    });

    res.json({
      success: true,
      message: `${field} updated successfully`,
      preferences,
    });
  } catch (error) {
    console.error(`Error updating ${req.params.field}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get available payment methods
router.get("/payment-methods", authenticate, async (req: AuthRequest, res) => {
  try {
    const paymentMethods = [
      { value: "STRIPE_CARD", label: "Credit/Debit Card", icon: "💳" },
      { value: "STRIPE_ACH", label: "Bank Transfer (ACH)", icon: "🏦" },
      { value: "CRYPTO_USDC", label: "USDC (Crypto)", icon: "🪙" },
      { value: "CRYPTO_ETH", label: "Ethereum", icon: "🔷" },
      { value: "BANK_WIRE", label: "Wire Transfer", icon: "🏛️" },
      { value: "PAYPAL", label: "PayPal", icon: "💰" },
      { value: "APPLE_PAY", label: "Apple Pay", icon: "🍎" },
      { value: "GOOGLE_PAY", label: "Google Pay", icon: "🤖" },
    ];

    res.json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
