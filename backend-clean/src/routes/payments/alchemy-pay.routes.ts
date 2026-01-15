import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { alchemyPayService } from '../../services/alchemy-pay.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * Get supported cryptocurrencies
 * GET /api/payments/alchemy/supported-cryptos
 */
router.get('/supported-cryptos', async (req, res) => {
  try {
    const cryptos = await alchemyPayService.getSupportedCryptos();
    res.json({ success: true, cryptos });
  } catch (error: any) {
    console.error('Get supported cryptos error:', error);
    res.status(500).json({ error: 'Failed to get supported cryptocurrencies' });
  }
});

/**
 * Get supported fiat currencies
 * GET /api/payments/alchemy/supported-fiat
 */
router.get('/supported-fiat', async (req, res) => {
  try {
    const fiatCurrencies = await alchemyPayService.getSupportedFiat();
    res.json({ success: true, fiatCurrencies });
  } catch (error: any) {
    console.error('Get supported fiat error:', error);
    res.status(500).json({ error: 'Failed to get supported fiat currencies' });
  }
});

/**
 * Calculate exchange rate
 * POST /api/payments/alchemy/calculate-rate
 */
router.post('/calculate-rate', authenticate, async (req: AuthRequest, res) => {
  try {
    const { fiatAmount, fiatCurrency, cryptoCurrency } = req.body;

    if (!fiatAmount || !fiatCurrency || !cryptoCurrency) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const calculation = await alchemyPayService.calculateExchangeRate(
      parseFloat(fiatAmount),
      fiatCurrency,
      cryptoCurrency
    );

    res.json({
      success: true,
      fiatAmount: parseFloat(fiatAmount),
      fiatCurrency,
      cryptoCurrency,
      ...calculation,
    });
  } catch (error: any) {
    console.error('Calculate rate error:', error);
    res.status(500).json({ error: 'Failed to calculate exchange rate' });
  }
});

/**
 * Create fiat to crypto payment
 * POST /api/payments/alchemy/create
 */
router.post('/create', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!alchemyPayService.isConfigured()) {
      return res.status(503).json({
        error: 'Alchemy Pay is not configured. Please add API credentials to environment variables.',
      });
    }

    const { amount, fiatCurrency, cryptoCurrency } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (!fiatCurrency) {
      return res.status(400).json({ error: 'Fiat currency is required' });
    }

    if (!cryptoCurrency) {
      return res.status(400).json({ error: 'Crypto currency is required' });
    }

    // Create payment with Alchemy Pay
    const payment = await alchemyPayService.createPayment(
      amount,
      fiatCurrency,
      cryptoCurrency,
      userId
    );

    // Save transaction to database
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    await prisma.transaction.create({
      data: {
        userId,
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount,
        currency: fiatCurrency,
        status: 'PENDING',
        method: 'CRYPTO_USDC', // Placeholder
        metadata: {
          orderId: payment.orderId,
          orderNo: payment.orderNo,
          cryptoCurrency,
          fiatCurrency,
          paymentProvider: 'ALCHEMY_PAY',
        },
      },
    });

    res.json({
      success: true,
      paymentUrl: payment.paymentUrl,
      orderId: payment.orderId,
      orderNo: payment.orderNo,
      status: payment.status,
    });
  } catch (error: any) {
    console.error('Alchemy Pay create payment error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment' });
  }
});

/**
 * Check payment status
 * GET /api/payments/alchemy/status/:orderId
 */
router.get('/status/:orderId', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!alchemyPayService.isConfigured()) {
      return res.status(503).json({ error: 'Alchemy Pay is not configured' });
    }

    const { orderId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if transaction belongs to user
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        walletId: wallet.id,
        metadata: {
          path: ['orderId'],
          equals: orderId,
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Get status from Alchemy Pay
    const status = await alchemyPayService.checkPaymentStatus(orderId);

    // Update transaction if completed
    if (status.status === 'COMPLETED' && transaction.status !== 'COMPLETED') {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            metadata: {
              ...(transaction.metadata as any),
              ...status,
              completedAt: new Date().toISOString(),
            },
          },
        }),
        prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: parseFloat(status.cryptoAmount || '0') },
          },
        }),
      ]);
    }

    res.json({
      success: true,
      orderId: status.orderId,
      status: status.status,
      cryptoAmount: status.cryptoAmount,
      crypto: status.crypto,
      fiatAmount: status.fiatAmount,
      fiatCurrency: status.fiatCurrency,
    });
  } catch (error: any) {
    console.error('Alchemy Pay status error:', error);
    res.status(500).json({ error: error.message || 'Failed to check status' });
  }
});

/**
 * Get user's Alchemy Pay transactions
 * GET /api/payments/alchemy/transactions
 */
router.get('/transactions', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        metadata: {
          path: ['paymentProvider'],
          equals: 'ALCHEMY_PAY',
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({
      success: true,
      transactions: transactions.map((tx: any) => ({
        id: tx.id,
        amount: Number(tx.amount),
        currency: tx.currency,
        status: tx.status,
        type: tx.type,
        createdAt: tx.createdAt,
        metadata: tx.metadata,
      })),
    });
  } catch (error: any) {
    console.error('Get Alchemy Pay transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

/**
 * Webhook handler for Alchemy Pay
 * POST /api/payments/alchemy/webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-alchemy-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const success = await alchemyPayService.handleWebhook(req.body, signature);

    if (success) {
      // Update transaction in database
      const { merchantOrderNo, status, cryptoAmount } = req.body;

      if (status === 'COMPLETED') {
        // Find and update transaction
        const transaction = await prisma.transaction.findFirst({
          where: {
            metadata: {
              path: ['orderNo'],
              equals: merchantOrderNo,
            },
          },
          include: { wallet: true },
        });

        if (transaction && transaction.status !== 'COMPLETED') {
          await prisma.$transaction([
            prisma.transaction.update({
              where: { id: transaction.id },
              data: {
                status: 'COMPLETED',
                metadata: {
                  ...(transaction.metadata as any),
                  cryptoAmount,
                  completedAt: new Date().toISOString(),
                },
              },
            }),
            prisma.wallet.update({
              where: { id: transaction.walletId },
              data: {
                balance: { increment: parseFloat(cryptoAmount || '0') },
              },
            }),
          ]);

          console.log(`Credited ${cryptoAmount} to wallet ${transaction.walletId}`);
        }
      }

      res.json({ received: true });
    } else {
      res.status(400).json({ error: 'Invalid webhook' });
    }
  } catch (error: any) {
    console.error('Alchemy Pay webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export default router;
