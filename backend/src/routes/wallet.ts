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

// Get all wallets for user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const wallets = store.findWalletsByUser(userId);
    
    return res.json({ wallets });
  } catch (error: any) {
    console.error('Get wallets error:', error);
    return res.status(500).json({ error: 'Failed to retrieve wallets' });
  }
});

// Create new wallet
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { type, currency, address } = req.body;

    if (!type || !currency) {
      return res.status(400).json({ error: 'Type and currency required' });
    }

    // Check if wallet already exists
    const existingWallet = store.findWallet(userId, currency);
    if (existingWallet) {
      return res.status(409).json({ error: 'Wallet already exists for this currency' });
    }

    const wallet = store.createWallet({
      userId,
      type,
      currency: currency.toUpperCase(),
      address,
      balance: 0
    });

    return res.status(201).json({
      message: 'Wallet created successfully',
      wallet
    });
  } catch (error: any) {
    console.error('Create wallet error:', error);
    return res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Get wallet balance
router.get('/:currency', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const currency = String((req.params as any).currency);

    const wallet = store.findWallet(userId, currency.toUpperCase());
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    return res.json({ 
      currency: wallet.currency,
      balance: wallet.balance,
      type: wallet.type,
      address: wallet.address
    });
  } catch (error: any) {
    console.error('Get wallet balance error:', error);
    return res.status(500).json({ error: 'Failed to retrieve wallet balance' });
  }
});

export default router;
