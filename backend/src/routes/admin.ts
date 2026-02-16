import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { store } from '../store';

const router = Router();

// Admin middleware
const adminMiddleware = (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    const user = store.findUserById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all users
router.get('/users', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const users = store.getAllUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    res.json({ users: usersWithoutPasswords });
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get user statistics
router.get('/stats', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const userStats = store.getUserStats();
    const systemStats = store.getStats();
    
    res.json({ 
      userStats,
      systemStats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

// Get user details with activity
router.get('/users/:userId', adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = store.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's wallets and transactions
    const wallets = store.findWalletsByUser(userId);
    const transactions = store.findTransactionsByUser(userId);
    const healthcare = store.findHealthcareByUser(userId);
    
    // Remove password
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      wallets,
      transactions,
      healthcare,
      stats: {
        walletCount: wallets.length,
        transactionCount: transactions.length,
        subscriptionCount: healthcare.length,
        totalBalance: wallets.reduce((sum, w) => sum + w.balance, 0)
      }
    });
  } catch (error: any) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

export default router;
