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

// Get user's healthcare subscriptions
router.get('/subscriptions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const subscriptions = store.findHealthcareByUser(userId);
    
    return res.json({ subscriptions });
  } catch (error: any) {
    console.error('Get subscriptions error:', error);
    return res.status(500).json({ error: 'Failed to retrieve subscriptions' });
  }
});

// Create healthcare subscription
router.post('/subscriptions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { plan, provider, monthlyPremium, dependents } = req.body;

    if (!plan || !provider || !monthlyPremium) {
      return res.status(400).json({ error: 'Plan, provider, and premium required' });
    }

    const startDate = new Date();
    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    const subscription = store.createHealthcare({
      userId,
      plan,
      provider,
      monthlyPremium,
      dependents: dependents || 0,
      startDate,
      renewalDate,
      status: 'active'
    });

    return res.status(201).json({
      message: 'Healthcare subscription created successfully',
      subscription
    });
  } catch (error: any) {
    console.error('Create subscription error:', error);
    return res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Get available plans
router.get('/plans', async (_req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 'basic',
        name: 'Basic',
        monthlyPremium: 99,
        coverage: ['Basic medical', 'Emergency care', 'Prescription drugs'],
        dependents: 0
      },
      {
        id: 'premium',
        name: 'Premium',
        monthlyPremium: 199,
        coverage: ['Comprehensive medical', 'Dental', 'Vision', 'Mental health'],
        dependents: 0
      },
      {
        id: 'family',
        name: 'Family',
        monthlyPremium: 349,
        coverage: ['Full family coverage', 'Dental', 'Vision', 'Pediatric care'],
        dependents: 4
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        monthlyPremium: 599,
        coverage: ['Premium for all employees', 'Customizable', 'Wellness programs'],
        dependents: 10
      }
    ];

    return res.json({ plans });
  } catch (error: any) {
    console.error('Get plans error:', error);
    return res.status(500).json({ error: 'Failed to retrieve plans' });
  }
});

export default router;
