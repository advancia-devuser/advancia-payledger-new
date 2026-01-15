import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Mock exchange rates (in production, fetch from API like CoinGecko, Binance, etc.)
const getExchangeRates = async () => {
  return {
    BTC: { usd: 45000, name: 'Bitcoin' },
    ETH: { usd: 2500, name: 'Ethereum' },
    USDT: { usd: 1.0, name: 'Tether' },
    USDC: { usd: 1.0, name: 'USD Coin' },
    BNB: { usd: 320, name: 'Binance Coin' },
    SOL: { usd: 110, name: 'Solana' },
    XRP: { usd: 0.65, name: 'Ripple' },
    ADA: { usd: 0.55, name: 'Cardano' },
    DOGE: { usd: 0.08, name: 'Dogecoin' },
    TRX: { usd: 0.12, name: 'Tron' }
  };
};

// Get current exchange rates
router.get('/rates', authenticate, async (req: Request, res: Response) => {
  try {
    const rates = await getExchangeRates();
    
    return res.json({
      success: true,
      rates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get rates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch exchange rates'
    });
  }
});

// Convert crypto to USD or USD to crypto
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const userId = (req as any).user.id;

    // Validation
    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fromCurrency, toCurrency, amount'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    if (fromCurrency === toCurrency) {
      return res.status(400).json({
        success: false,
        error: 'Cannot convert to the same currency'
      });
    }

    // Get current rates
    const rates = await getExchangeRates();

    // Calculate conversion
    let convertedAmount = 0;
    let rate = 0;

    if (fromCurrency === 'USD') {
      // USD to Crypto
      const cryptoRate = rates[toCurrency as keyof typeof rates];
      if (!cryptoRate) {
        return res.status(400).json({
          success: false,
          error: `Unsupported cryptocurrency: ${toCurrency}`
        });
      }
      rate = cryptoRate.usd;
      convertedAmount = amount / rate;
    } else if (toCurrency === 'USD') {
      // Crypto to USD
      const cryptoRate = rates[fromCurrency as keyof typeof rates];
      if (!cryptoRate) {
        return res.status(400).json({
          success: false,
          error: `Unsupported cryptocurrency: ${fromCurrency}`
        });
      }
      rate = cryptoRate.usd;
      convertedAmount = amount * rate;
    } else {
      // Crypto to Crypto (convert through USD)
      const fromRate = rates[fromCurrency as keyof typeof rates];
      const toRate = rates[toCurrency as keyof typeof rates];
      
      if (!fromRate || !toRate) {
        return res.status(400).json({
          success: false,
          error: 'Unsupported cryptocurrency pair'
        });
      }
      
      const usdAmount = amount * fromRate.usd;
      convertedAmount = usdAmount / toRate.usd;
      rate = fromRate.usd / toRate.usd;
    }

    // Apply conversion fee (0.5%)
    const fee = convertedAmount * 0.005;
    const finalAmount = convertedAmount - fee;

    // In production, check user balance and update database
    // For now, return the conversion details

    return res.json({
      success: true,
      conversion: {
        from: {
          currency: fromCurrency,
          amount: amount
        },
        to: {
          currency: toCurrency,
          amount: finalAmount
        },
        rate: rate,
        fee: fee,
        feePercentage: 0.5,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Convert error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process conversion'
    });
  }
});

// Get conversion history
router.get('/history', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // In production, fetch from database
    const history = [
      {
        id: 'conv_1',
        fromCurrency: 'BTC',
        toCurrency: 'USD',
        fromAmount: 0.001,
        toAmount: 45.0,
        rate: 45000,
        fee: 0.225,
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'conv_2',
        fromCurrency: 'USD',
        toCurrency: 'ETH',
        fromAmount: 100,
        toAmount: 0.0399,
        rate: 2500,
        fee: 0.0002,
        status: 'completed',
        timestamp: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    return res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch conversion history'
    });
  }
});

export default router;
