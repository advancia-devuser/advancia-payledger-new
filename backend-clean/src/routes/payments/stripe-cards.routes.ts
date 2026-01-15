import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth';
import { stripeService } from '../../services/stripe.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * Create virtual card
 * POST /api/payments/stripe-cards/create
 */
router.post('/create', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripeService.isConfigured()) {
      return res.status(503).json({
        error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.',
      });
    }

    const { amount } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Check if user has sufficient wallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.balance) < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Create card with Stripe
    const stripeCard = await stripeService.createVirtualCard(userId, amount);

    // Save to database and deduct from wallet (atomic transaction)
    const result = await prisma.$transaction(async (tx: any) => {
      // Deduct from wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      // Create virtual card record
      const card = await tx.virtualCard.create({
        data: {
          userId,
          cardNumber: `****${stripeCard.last4}`,
          cardholderName: `User ${userId}`,
          expiryDate: `${String(stripeCard.expMonth).padStart(2, '0')}/${stripeCard.expYear}`,
          cvv: '***',
          bin: '****',
          last4: stripeCard.last4.toString(),
          balance: amount,
          currency: 'USD',
          status: 'active',
          stripeCardId: stripeCard.id,
        },
      });

      return card;
    });

    const [expMonth, expYear] = result.expiryDate.split('/');

    res.json({
      success: true,
      card: {
        id: result.id,
        last4: result.last4,
        expMonth: parseInt(expMonth),
        expYear: parseInt(expYear),
        balance: Number(result.balance),
        status: result.status,
      },
    });
  } catch (error: any) {
    console.error('Card creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create card' });
  }
});

/**
 * Fund card from wallet
 * POST /api/payments/stripe-cards/fund
 */
router.post('/fund', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripeService.isConfigured()) {
      return res.status(503).json({ error: 'Stripe is not configured' });
    }

    const { cardId, amount } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Check card ownership
    const card = await prisma.virtualCard.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    if (card.status !== 'active') {
      return res.status(400).json({ error: 'Card is not active' });
    }

    // Check wallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet || Number(wallet.balance) < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update Stripe card limit
    const newBalance = Number(card.balance) + amount;
    if (card.stripeCardId) {
      await stripeService.updateCardLimit(card.stripeCardId, newBalance);
    }

    // Update database (atomic)
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.virtualCard.update({
        where: { id: cardId },
        data: { balance: { increment: amount } },
      }),
    ]);

    res.json({
      success: true,
      newBalance,
    });
  } catch (error: any) {
    console.error('Card funding error:', error);
    res.status(500).json({ error: error.message || 'Failed to fund card' });
  }
});

/**
 * Get card details
 * GET /api/payments/stripe-cards/:cardId
 */
router.get('/:cardId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const card = await prisma.virtualCard.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const [expMonth, expYear] = card.expiryDate.split('/');

    res.json({
      success: true,
      card: {
        id: card.id,
        last4: card.last4,
        expMonth,
        expYear,
        balance: Number(card.balance),
        status: card.status,
        currency: card.currency,
      },
    });
  } catch (error: any) {
    console.error('Get card error:', error);
    res.status(500).json({ error: 'Failed to get card details' });
  }
});

/**
 * Get all user cards
 * GET /api/payments/stripe-cards
 */
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const cards = await prisma.virtualCard.findMany({
      where: { userId, stripeCardId: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      cards: cards.map((card: any) => {
        const [expMonth, expYear] = card.expiryDate.split('/');
        return {
          id: card.id,
          last4: card.last4,
          expMonth,
          expYear,
          balance: Number(card.balance),
          status: card.status,
          currency: card.currency,
          createdAt: card.createdAt,
        };
      }),
    });
  } catch (error: any) {
    console.error('Get cards error:', error);
    res.status(500).json({ error: 'Failed to get cards' });
  }
});

/**
 * Freeze/unfreeze card
 * POST /api/payments/stripe-cards/:cardId/status
 */
router.post('/:cardId/status', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripeService.isConfigured()) {
      return res.status(503).json({ error: 'Stripe is not configured' });
    }

    const { cardId } = req.params;
    const { active } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const card = await prisma.virtualCard.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Update Stripe card status
    if (card.stripeCardId) {
      await stripeService.setCardStatus(card.stripeCardId, active);
    }

    // Update database
    await prisma.virtualCard.update({
      where: { id: cardId },
      data: { status: active ? 'active' : 'frozen' },
    });

    res.json({
      success: true,
      status: active ? 'active' : 'frozen',
    });
  } catch (error: any) {
    console.error('Card status update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update card status' });
  }
});

/**
 * Get card transactions
 * GET /api/payments/stripe-cards/:cardId/transactions
 */
router.get('/:cardId/transactions', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!stripeService.isConfigured()) {
      return res.status(503).json({ error: 'Stripe is not configured' });
    }

    const { cardId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const card = await prisma.virtualCard.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // Get transactions from database
    const dbTransactions = await prisma.cardTransaction.findMany({
      where: { cardId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Also try to get from Stripe if available
    let stripeTransactions: any[] = [];
    if (card.stripeCardId) {
      try {
        stripeTransactions = await stripeService.getCardTransactions(card.stripeCardId, 20);
      } catch (err) {
        console.log('Could not fetch Stripe transactions:', err);
      }
    }

    res.json({
      success: true,
      transactions: [
        ...dbTransactions.map((tx: any) => ({
          id: tx.id,
          amount: Number(tx.amount),
          currency: tx.currency,
          merchant: tx.merchant,
          status: tx.status,
          description: tx.description,
          created: tx.createdAt.toISOString(),
          source: 'database',
        })),
        ...stripeTransactions.map(tx => ({ ...tx, source: 'stripe' })),
      ],
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

/**
 * Stripe webhook handler
 * POST /api/payments/stripe-cards/webhook
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const result = await stripeService.handleWebhook(req.body, signature);
    res.json(result);
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export default router;
