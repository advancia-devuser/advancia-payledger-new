import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// In-memory card storage (in production, use database)
interface Card {
  id: string;
  userId: string;
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  status: 'frozen' | 'active';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

let cards: Card[] = [];

// Generate random card number
const generateCardNumber = (): string => {
  const bin = '424242'; // Test BIN
  const accountNumber = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
  return bin + accountNumber;
};

// Generate CVV
const generateCVV = (): string => {
  return Math.floor(Math.random() * 900 + 100).toString();
};

// Generate expiry date (3 years from now)
const generateExpiryDate = (): string => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = (now.getFullYear() + 3).toString().slice(-2);
  return `${month}/${year}`;
};

// Create card for user (called on registration)
router.post('/create', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userName = (req as any).user.name || 'Card Holder';

    // Check if user already has a card
    const existingCard = cards.find(card => card.userId === userId);
    if (existingCard) {
      return res.json({
        success: true,
        card: existingCard,
        message: 'Card already exists'
      });
    }

    // Create new card
    const newCard: Card = {
      id: `card_${Date.now()}`,
      userId,
      cardNumber: generateCardNumber(),
      cardholderName: userName,
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      status: 'frozen',
      balance: 0.00,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    cards.push(newCard);

    return res.json({
      success: true,
      card: newCard,
      message: 'Card created successfully'
    });
  } catch (error) {
    console.error('Create card error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create card'
    });
  }
});

// Get user's card
router.get('/my-card', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userName = (req as any).user.name || 'Card Holder';

    let card = cards.find(card => card.userId === userId);

    // Auto-create card if doesn't exist
    if (!card) {
      card = {
        id: `card_${Date.now()}`,
        userId,
        cardNumber: generateCardNumber(),
        cardholderName: userName,
        expiryDate: generateExpiryDate(),
        cvv: generateCVV(),
        status: 'frozen',
        balance: 0.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      cards.push(card);
    }

    return res.json({
      success: true,
      card
    });
  } catch (error) {
    console.error('Get card error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch card'
    });
  }
});

// Update card balance
router.post('/update-balance', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { amount, type } = req.body; // type: 'add' or 'subtract'

    const card = cards.find(card => card.userId === userId);
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    if (type === 'add') {
      card.balance += amount;
    } else if (type === 'subtract') {
      if (card.balance < amount) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient balance'
        });
      }
      card.balance -= amount;
    }

    card.updatedAt = new Date().toISOString();

    return res.json({
      success: true,
      card,
      message: 'Balance updated successfully'
    });
  } catch (error) {
    console.error('Update balance error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update balance'
    });
  }
});

// Activate card (admin only)
router.post('/activate/:cardId', authenticate, async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    const card = cards.find(card => card.id === cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    card.status = 'active';
    card.updatedAt = new Date().toISOString();

    return res.json({
      success: true,
      card,
      message: 'Card activated successfully'
    });
  } catch (error) {
    console.error('Activate card error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to activate card'
    });
  }
});

// Freeze card (admin only)
router.post('/freeze/:cardId', authenticate, async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    const card = cards.find(card => card.id === cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    card.status = 'frozen';
    card.updatedAt = new Date().toISOString();

    return res.json({
      success: true,
      card,
      message: 'Card frozen successfully'
    });
  } catch (error) {
    console.error('Freeze card error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to freeze card'
    });
  }
});

// Get all cards (admin only)
router.get('/all', authenticate, async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      cards,
      count: cards.length
    });
  } catch (error) {
    console.error('Get all cards error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch cards'
    });
  }
});

export default router;
