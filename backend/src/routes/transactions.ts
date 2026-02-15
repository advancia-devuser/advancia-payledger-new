import { Router, Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Wallet from '../models/Wallet';
import jwt from 'jsonwebtoken';

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
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all transactions for user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { limit = 50, offset = 0, status, type } = req.query;

    const query: any = { userId };
    if (status) query.status = status;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
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
      const wallet = await Wallet.findOne({ userId, currency: currency.toUpperCase() });
      if (!wallet || wallet.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
    }

    const transaction = new Transaction({
      userId,
      type,
      currency: currency.toUpperCase(),
      amount,
      fee: amount * 0.01, // 1% fee
      toAddress,
      status: 'pending',
      metadata
    });

    await transaction.save();

    // Update wallet balance (simplified - in production use transactions)
    if (type === 'send') {
      await Wallet.findOneAndUpdate(
        { userId, currency: currency.toUpperCase() },
        { $inc: { balance: -(amount + transaction.fee) } }
      );
    } else if (type === 'receive') {
      await Wallet.findOneAndUpdate(
        { userId, currency: currency.toUpperCase() },
        { $inc: { balance: amount } }
      );
    }

    // Simulate transaction completion after 2 seconds
    setTimeout(async () => {
      await Transaction.findByIdAndUpdate(transaction._id, { status: 'completed' });
    }, 2000);

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error: any) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get transaction by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const transaction = await Transaction.findOne({ _id: id, userId });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error: any) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
});

export default router;
