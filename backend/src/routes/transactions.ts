import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../store';

const router = Router();

// Middleware to verify JWT
const authMiddleware = (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    (req as any).userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all transactions for user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { limit = 50, offset = 0, status, type } = req.query;

    const transactions = store.findTransactionsByUser(userId, {
      status: status as string,
      type: type as string
    });

    const paginatedTxs = transactions.slice(Number(offset), Number(offset) + Number(limit));

    return res.json({
      transactions: paginatedTxs,
      pagination: {
        total: transactions.length,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

// Create new transaction
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { type, currency, amount, toAddress, metadata } = req.body;

    if (!type || !currency || !amount) {
      return res.status(400).json({ error: 'Type, currency, and amount required' });
    }

    // Validate sufficient balance for send transactions
    if (type === 'send') {
      const wallet = store.findWallet(userId, currency);
      if (!wallet || wallet.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
    }

    const transaction = store.createTransaction({
      userId,
      type,
      currency: currency.toUpperCase(),
      amount,
      fee: amount * 0.01, // 1% fee
      toAddress,
      status: 'pending',
      metadata
    });

    // Update wallet balance (simplified)
    if (type === 'send') {
      const wallet = store.findWallet(userId, currency);
      if (wallet) {
        store.updateWalletBalance(wallet.id, -(amount + transaction.fee));
      }
    } else if (type === 'receive') {
      const wallet = store.findWallet(userId, currency);
      if (wallet) {
        store.updateWalletBalance(wallet.id, amount);
      }
    }

    // Simulate transaction completion after 2 seconds
    setTimeout(() => {
      store.updateTransaction(transaction.id, { status: 'completed' });
    }, 2000);

    return res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    return res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get transaction by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const id = String((req.params as any).id);

    const transaction = store.findTransactionById(id, userId);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.json({ transaction });
  } catch (error: any) {
    console.error('Get transaction error:', error);
    return res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
});

export default router;
