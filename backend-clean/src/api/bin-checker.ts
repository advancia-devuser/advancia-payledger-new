import { Router, Request, Response } from 'express';

const router = Router();

// BIN database (sample data - in production, use a real BIN database API)
const binDatabase: Record<string, any> = {
  '424242': {
    bin: '424242',
    brand: 'Visa',
    type: 'Credit',
    category: 'Classic',
    issuer: 'Stripe Test Bank',
    country: 'United States',
    countryCode: 'US',
    website: 'https://stripe.com',
    phone: '+1-888-926-2289',
    valid: true,
    googleAdsOptimized: true,
    declineRate: '0.5%',
    successRate: '99.5%',
    avgSpend: '$2,500',
    billingThreshold: '$500'
  },
  '411111': {
    bin: '411111',
    brand: 'Visa',
    type: 'Credit',
    category: 'Standard',
    issuer: 'Test Bank',
    country: 'United States',
    countryCode: 'US',
    website: '',
    phone: '',
    valid: true,
    googleAdsOptimized: false,
    declineRate: '1.2%',
    successRate: '98.8%',
    avgSpend: '$1,200',
    billingThreshold: '$250'
  },
  '520000': {
    bin: '520000',
    brand: 'Mastercard',
    type: 'Debit',
    category: 'Standard',
    issuer: 'Mastercard Test',
    country: 'United States',
    countryCode: 'US',
    website: '',
    phone: '',
    valid: true,
    googleAdsOptimized: false,
    declineRate: '2.1%',
    successRate: '97.9%',
    avgSpend: '$800',
    billingThreshold: '$200'
  },
  '545454': {
    bin: '545454',
    brand: 'Mastercard',
    type: 'Credit',
    category: 'Platinum',
    issuer: 'Wells Fargo',
    country: 'United States',
    countryCode: 'US',
    website: 'https://wellsfargo.com',
    phone: '+1-800-869-3557',
    valid: true,
    googleAdsOptimized: true,
    declineRate: '0.3%',
    successRate: '99.7%',
    avgSpend: '$5,000',
    billingThreshold: '$1,000'
  },
  '400000': {
    bin: '400000',
    brand: 'Visa',
    type: 'Credit',
    category: 'Gold',
    issuer: 'Citibank',
    country: 'United States',
    countryCode: 'US',
    website: 'https://citibank.com',
    phone: '+1-800-374-9700',
    valid: true,
    googleAdsOptimized: true,
    declineRate: '0.4%',
    successRate: '99.6%',
    avgSpend: '$3,500',
    billingThreshold: '$750'
  },
  '510000': {
    bin: '510000',
    brand: 'Mastercard',
    type: 'Credit',
    category: 'Platinum',
    issuer: 'TD Bank',
    country: 'United States',
    countryCode: 'US',
    website: 'https://tdbank.com',
    phone: '+1-888-751-9000',
    valid: true,
    googleAdsOptimized: true,
    declineRate: '0.6%',
    successRate: '99.4%',
    avgSpend: '$4,200',
    billingThreshold: '$900'
  }
};

// Check BIN endpoint
router.get('/:bin', async (req: Request, res: Response) => {
  try {
    const { bin } = req.params;

    // Validate BIN format
    if (!bin || bin.length < 6 || !/^\d+$/.test(bin)) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid BIN format. Please provide at least 6 digits.'
      });
    }

    const binPrefix = bin.substring(0, 6);

    // Check if BIN exists in database
    const binInfo = binDatabase[binPrefix];

    if (binInfo) {
      return res.json(binInfo);
    }

    // If not in database, return generic info based on first digit (MII)
    const firstDigit = bin.charAt(0);
    let brand = 'Unknown';
    let type = 'Unknown';

    if (firstDigit === '4') {
      brand = 'Visa';
      type = 'Credit/Debit';
    } else if (firstDigit === '5') {
      brand = 'Mastercard';
      type = 'Credit/Debit';
    } else if (firstDigit === '3') {
      brand = 'American Express';
      type = 'Credit';
    } else if (firstDigit === '6') {
      brand = 'Discover';
      type = 'Credit/Debit';
    }

    return res.json({
      bin: binPrefix,
      brand,
      type,
      category: 'Standard',
      issuer: 'Unknown Bank',
      country: 'Unknown',
      countryCode: 'XX',
      website: '',
      phone: '',
      valid: true,
      googleAdsOptimized: false,
      declineRate: 'N/A',
      successRate: 'N/A',
      avgSpend: 'N/A',
      billingThreshold: 'N/A'
    });

  } catch (error) {
    console.error('BIN checker error:', error);
    return res.status(500).json({
      valid: false,
      error: 'Failed to check BIN. Please try again.'
    });
  }
});

// Get all Google Ads optimized BINs
router.get('/google-ads/optimized', async (req: Request, res: Response) => {
  try {
    const optimizedBins = Object.values(binDatabase).filter(
      (bin) => bin.googleAdsOptimized
    );

    return res.json({
      count: optimizedBins.length,
      bins: optimizedBins
    });
  } catch (error) {
    console.error('Error fetching Google Ads BINs:', error);
    return res.status(500).json({
      error: 'Failed to fetch optimized BINs'
    });
  }
});

export default router;
