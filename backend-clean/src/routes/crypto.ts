import { Request, Response, Router } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { getNowPaymentsService } from "../services/nowPaymentsService";
import { validateCryptoAddress } from "../utils/walletValidation";

const router = Router();

// Create crypto payment
router.post(
  "/create-payment",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const nowPayments = getNowPaymentsService();
      if (!nowPayments) {
        res
          .status(503)
          .json({ error: "Crypto payment service not configured" });
        return;
      }

      const { amount, currency, payCurrency, orderId, description } = req.body;

      if (!amount || !currency || !payCurrency) {
        res
          .status(400)
          .json({ error: "Amount, currency, and pay currency are required" });
        return;
      }

      const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const payment = await nowPayments.createPayment({
        price_amount: amount,
        price_currency: currency,
        pay_currency: payCurrency,
        order_id: orderId || `order_${Date.now()}`,
        order_description: description || "Crypto payment",
        ipn_callback_url: `${
          process.env.BACKEND_URL || "http://localhost:3001"
        }/api/crypto/webhook`,
        success_url: `${baseUrl}/payment/success`,
        cancel_url: `${baseUrl}/payment/cancel`,
      });

      res.json({
        paymentId: payment.payment_id,
        paymentUrl: nowPayments.getPaymentUrl(payment.payment_id),
        payAddress: payment.pay_address,
        payAmount: payment.pay_amount,
        payCurrency: payment.pay_currency,
      });
    } catch (error: any) {
      console.error("Create crypto payment error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to create crypto payment" });
    }
  }
);

// Get payment status
router.get(
  "/payment/:paymentId",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const nowPayments = getNowPaymentsService();
      if (!nowPayments) {
        res
          .status(503)
          .json({ error: "Crypto payment service not configured" });
        return;
      }

      const { paymentId } = req.params;
      const status = await nowPayments.getPaymentStatus(paymentId);

      res.json({
        paymentId: status.payment_id,
        status: nowPayments.mapPaymentStatus(status.payment_status),
        rawStatus: status.payment_status,
        payAddress: status.pay_address,
        payAmount: status.pay_amount,
        payCurrency: status.pay_currency,
        priceAmount: status.price_amount,
        priceCurrency: status.price_currency,
        actuallyPaid: status.actually_paid,
        isFinal: nowPayments.isFinalStatus(status.payment_status),
      });
    } catch (error: any) {
      console.error("Get payment status error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to get payment status" });
    }
  }
);

// Get available cryptocurrencies
router.get(
  "/currencies",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const nowPayments = getNowPaymentsService();
      if (!nowPayments) {
        res
          .status(503)
          .json({ error: "Crypto payment service not configured" });
        return;
      }

      const currencies = await nowPayments.getAvailableCurrencies();

      res.json({
        currencies,
        count: currencies.length,
      });
    } catch (error: any) {
      console.error("Get currencies error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to get currencies" });
    }
  }
);

// Get exchange rate estimate
router.post(
  "/estimate",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const nowPayments = getNowPaymentsService();
      if (!nowPayments) {
        res
          .status(503)
          .json({ error: "Crypto payment service not configured" });
        return;
      }

      const { fromCurrency, toCurrency, amount } = req.body;

      if (!fromCurrency || !toCurrency || !amount) {
        res
          .status(400)
          .json({
            error: "From currency, to currency, and amount are required",
          });
        return;
      }

      const estimate = await nowPayments.getEstimate(
        fromCurrency,
        toCurrency,
        amount
      );

      res.json(estimate);
    } catch (error: any) {
      console.error("Get estimate error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to get estimate" });
    }
  }
);

// Validate wallet address
router.post(
  "/validate-address",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { address, cryptoType } = req.body;

      if (!address || !cryptoType) {
        res.status(400).json({ error: "Address and crypto type are required" });
        return;
      }

      const validation = validateCryptoAddress(address, cryptoType);

      res.json({
        valid: validation.valid,
        error: validation.error,
        cryptoType,
        address,
      });
    } catch (error: any) {
      console.error("Validate address error:", error);
      res.status(500).json({ error: "Failed to validate address" });
    }
  }
);

// NOWPayments webhook handler
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const nowPayments = getNowPaymentsService();
    if (!nowPayments) {
      res.status(503).json({ error: "Crypto payment service not configured" });
      return;
    }

    const signature = req.headers["x-nowpayments-sig"] as string;
    const payload = JSON.stringify(req.body);

    if (!nowPayments.verifyWebhookSignature(payload, signature)) {
      console.error("Invalid webhook signature");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const event = req.body;
    console.log("NOWPayments webhook received:", {
      payment_id: event.payment_id,
      status: event.payment_status,
      order_id: event.order_id,
    });

    // Extract payment data
    const {
      payment_id,
      payment_status,
      pay_amount,
      pay_currency,
      price_amount,
      price_currency,
      order_id,
      actually_paid,
      outcome_amount,
      outcome_currency,
      pay_address,
    } = event;

    // Handle different payment statuses
    switch (payment_status) {
      case "finished":
        console.log("✅ Payment completed:", payment_id);
        // CRITICAL: Update database with successful payment
        try {
          const { PrismaClient } = await import("@prisma/client");
          const prisma = new PrismaClient();

          await prisma.$transaction(async (tx: any) => {
            // Find user's wallet using order_id (should be userId)
            const wallet = await tx.wallet.findFirst({
              where: { userId: order_id },
            });

            if (!wallet) {
              throw new Error(`Wallet not found for user ${order_id}`);
            }

            // Check if deposit already processed (prevent duplicates)
            const existingDeposit = await tx.cryptoDeposit.findUnique({
              where: { txHash: payment_id },
            });

            if (existingDeposit && existingDeposit.status === "CONFIRMED") {
              console.log(`Deposit ${payment_id} already processed`);
              return;
            }

            const depositAmount = parseFloat(outcome_amount || price_amount);
            const depositCurrency = outcome_currency || price_currency;

            // Create or update crypto deposit record
            const deposit = await tx.cryptoDeposit.upsert({
              where: { txHash: payment_id },
              update: {
                status: "CONFIRMED",
                confirmations: 999,
                confirmedAt: new Date(),
                amount: depositAmount,
                currency: depositCurrency,
              },
              create: {
                walletId: wallet.id,
                amount: depositAmount,
                currency: depositCurrency,
                payCurrency: pay_currency,
                payAmount: parseFloat(pay_amount),
                txHash: payment_id,
                confirmations: 999,
                status: "CONFIRMED",
                orderId: order_id,
                payAddress: pay_address,
                confirmedAt: new Date(),
                metadata: event,
              },
            });

            // Credit wallet balance ATOMICALLY
            const updatedWallet = await tx.wallet.update({
              where: { id: wallet.id },
              data: {
                balance: { increment: depositAmount },
              },
            });

            // Create transaction record for ledger
            await tx.transaction.create({
              data: {
                userId: order_id,
                walletId: wallet.id,
                type: "DEPOSIT",
                amount: depositAmount,
                currency: depositCurrency,
                status: "COMPLETED",
                method: "CRYPTO_USDC",
                cryptoTxHash: payment_id,
                metadata: {
                  payment_id,
                  pay_amount,
                  pay_currency,
                  actually_paid,
                  outcome_amount,
                  outcome_currency,
                },
              },
            });

            // Create notification for user
            await tx.notification.create({
              data: {
                userId: order_id,
                type: "transaction",
                title: "Crypto Deposit Received",
                message: `Your deposit of ${depositAmount} ${depositCurrency} has been confirmed and credited to your wallet.`,
                read: false,
                metadata: {
                  depositId: deposit.id,
                  amount: depositAmount,
                  currency: depositCurrency,
                },
              },
            });

            console.log(
              `✅ Balance credited: ${depositAmount} ${depositCurrency} to user ${order_id}`
            );
            console.log(`   New balance: ${updatedWallet.balance}`);
          });

          await prisma.$disconnect();
        } catch (dbError: any) {
          console.error("Database update error:", dbError);
          // Still return 200 to prevent NOWPayments from retrying
          // Log error for manual review
        }
        break;

      case "failed":
      case "expired":
        console.log("❌ Payment failed/expired:", payment_id);
        // Record failed payment for tracking
        try {
          const { PrismaClient } = await import("@prisma/client");
          const prisma = new PrismaClient();

          const wallet = await prisma.wallet.findFirst({
            where: { userId: order_id },
          });

          if (wallet) {
            await prisma.cryptoDeposit.upsert({
              where: { txHash: payment_id },
              update: {
                status: "FAILED",
                metadata: event,
              },
              create: {
                walletId: wallet.id,
                amount: parseFloat(price_amount || "0"),
                currency: price_currency || "USD",
                payCurrency: pay_currency,
                payAmount: parseFloat(pay_amount || "0"),
                txHash: payment_id,
                status: "FAILED",
                orderId: order_id,
                metadata: event,
              },
            });
          }

          await prisma.$disconnect();
        } catch (dbError: any) {
          console.error("Failed payment recording error:", dbError);
        }
        break;

      case "confirming":
        console.log("⏳ Payment confirming:", payment_id);
        // Update status to confirming
        try {
          const { PrismaClient } = await import("@prisma/client");
          const prisma = new PrismaClient();

          const wallet = await prisma.wallet.findFirst({
            where: { userId: order_id },
          });

          if (wallet) {
            await prisma.cryptoDeposit.upsert({
              where: { txHash: payment_id },
              update: {
                status: "CONFIRMING",
                confirmations: 1,
                metadata: event,
              },
              create: {
                walletId: wallet.id,
                amount: parseFloat(price_amount || "0"),
                currency: price_currency || "USD",
                payCurrency: pay_currency,
                payAmount: parseFloat(pay_amount || "0"),
                txHash: payment_id,
                status: "CONFIRMING",
                confirmations: 1,
                orderId: order_id,
                payAddress: pay_address,
                metadata: event,
              },
            });
          }

          await prisma.$disconnect();
        } catch (dbError: any) {
          console.error("Confirming status update error:", dbError);
        }
        break;

      case "partially_paid":
        console.log("⚠️ Payment partially paid:", payment_id);
        // Log for manual review - don't credit balance
        break;

      default:
        console.log("ℹ️ Payment status update:", payment_status);
    }

    // Always return 200 to acknowledge receipt
    res.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    // Still return 200 to prevent retries that could cause issues
    res.status(200).json({ error: "Processing error logged" });
  }
});

// Get crypto payment health
router.get("/health", async (req: Request, res: Response) => {
  try {
    const nowPayments = getNowPaymentsService();

    res.json({
      status: nowPayments ? "operational" : "not configured",
      service: "NOWPayments",
      configured: !!nowPayments,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Health check failed" });
  }
});

export default router;
