import { Router } from "express";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { currencyService } from "../../services/currencyService";

const router = Router();

// Get all supported currencies
router.get("/currencies", authenticate, async (req: AuthRequest, res) => {
  try {
    const currencies = await currencyService.getSupportedCurrencies();

    res.json({
      success: true,
      data: currencies,
      lastUpdated: currencyService.getLastRateUpdate(),
    });
  } catch (error) {
    console.error("Get currencies error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Convert currency
router.post("/convert", authenticate, async (req: AuthRequest, res) => {
  try {
    const { fromAmount, fromCurrency, toCurrency } = req.body;

    if (!fromAmount || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: fromAmount, fromCurrency, toCurrency",
      });
    }

    if (typeof fromAmount !== "number" || fromAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "fromAmount must be a positive number",
      });
    }

    const result = await currencyService.convertCurrency(
      fromAmount,
      fromCurrency,
      toCurrency
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Currency conversion error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get exchange rate
router.get(
  "/rate/:fromCurrency/:toCurrency",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { fromCurrency, toCurrency } = req.params;

      const rate = await currencyService.getExchangeRate(
        fromCurrency,
        toCurrency
      );

      res.json({
        success: true,
        data: {
          fromCurrency,
          toCurrency,
          rate,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Get exchange rate error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get user wallet balances
router.get("/wallet/balances", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    const balances = await currencyService.getUserWalletBalances(userId);

    res.json({
      success: true,
      data: balances,
    });
  } catch (error) {
    console.error("Get wallet balances error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get exchange rate history
router.get(
  "/rate/:fromCurrency/:toCurrency/history",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { fromCurrency, toCurrency } = req.params;
      const days = parseInt(req.query.days as string) || 30;

      const history = await currencyService.getExchangeRateHistory(
        fromCurrency,
        toCurrency,
        days
      );

      res.json({
        success: true,
        data: history,
        period: `${days} days`,
      });
    } catch (error) {
      console.error("Get exchange rate history error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get conversion history
router.get(
  "/conversions/history",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      const days = parseInt(req.query.days as string) || 30;
      const history = await currencyService.getConversionHistory(userId, days);

      res.json({
        success: true,
        data: history,
        period: `${days} days`,
      });
    } catch (error) {
      console.error("Get conversion history error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Validate currency
router.post("/validate", authenticate, async (req: AuthRequest, res) => {
  try {
    const { currencyCode } = req.body;

    if (!currencyCode) {
      return res.status(400).json({
        success: false,
        error: "Missing currency code",
      });
    }

    const isValid = await currencyService.isCurrencySupported(currencyCode);
    const currencyInfo = isValid
      ? currencyService.getCurrencyInfo(currencyCode)
      : null;

    res.json({
      success: true,
      data: {
        isValid,
        currencyInfo,
      },
    });
  } catch (error) {
    console.error("Validate currency error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Format currency amount
router.post("/format", authenticate, async (req: AuthRequest, res) => {
  try {
    const { amount, currencyCode } = req.body;

    if (typeof amount !== "number" || !currencyCode) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: amount (number), currencyCode",
      });
    }

    const formatted = currencyService.formatCurrency(amount, currencyCode);

    res.json({
      success: true,
      data: {
        amount,
        currencyCode,
        formatted,
      },
    });
  } catch (error) {
    console.error("Format currency error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Parse currency amount
router.post("/parse", authenticate, async (req: AuthRequest, res) => {
  try {
    const { formattedAmount, currencyCode } = req.body;

    if (!formattedAmount || !currencyCode) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: formattedAmount, currencyCode",
      });
    }

    const parsed = currencyService.parseCurrency(formattedAmount, currencyCode);

    res.json({
      success: true,
      data: {
        formattedAmount,
        currencyCode,
        parsedAmount: parsed,
      },
    });
  } catch (error) {
    console.error("Parse currency error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Admin only: Add new currency
router.post(
  "/admin/currencies",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (user?.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          error: "Admin access required",
        });
      }

      const currencyData = req.body;
      const newCurrency = await currencyService.addCurrency(currencyData);

      res.json({
        success: true,
        data: newCurrency,
        message: "Currency added successfully",
      });
    } catch (error) {
      console.error("Add currency error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Admin only: Update currency
router.put(
  "/admin/currencies/:code",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const user = req.user;
      if (user?.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          error: "Admin access required",
        });
      }

      const { code } = req.params;
      const updates = req.body;

      const updatedCurrency = await currencyService.updateCurrency(
        code,
        updates
      );

      res.json({
        success: true,
        data: updatedCurrency,
        message: "Currency updated successfully",
      });
    } catch (error) {
      console.error("Update currency error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get system status
router.get("/status", authenticate, async (req: AuthRequest, res) => {
  try {
    const currencies = await currencyService.getSupportedCurrencies();
    const lastUpdate = currencyService.getLastRateUpdate();

    res.json({
      success: true,
      data: {
        supportedCurrencies: currencies.length,
        lastRateUpdate: lastUpdate.toISOString(),
        updateInterval: "5 minutes",
        status: "operational",
      },
    });
  } catch (error) {
    console.error("Get currency status error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
