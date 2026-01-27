// Payment Processing System - 2.5% Fee Structure
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PAYMENT_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Payment Processing Configuration
const PAYMENT_CONFIG = {
    PROCESSING_FEE_RATE: 0.025, // 2.5%
    MINIMUM_FEE: 0.50,
    MAXIMUM_FEE: 100.00,
    BLOCKCHAIN_FEES: {
        solana: 0.00001, // ~$0.00025
        ethereum: 0.002, // ~$5.00
        polygon: 0.001, // ~$0.50
        base: 0.0005, // ~$0.25
        bsc: 0.0008 // ~$0.40
    }
};

// Revenue Tracking
let revenueMetrics = {
    totalProcessingFees: 0,
    totalBlockchainFees: 0,
    totalTransactions: 0,
    totalVolume: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    revenueStreams: {
        facilities: 149000,
        paymentProcessing: 62000,
        blockchainFees: 18000,
        premiumFeatures: 18000
    }
};

// Calculate Processing Fee
function calculateProcessingFee(amount) {
    const fee = amount * PAYMENT_CONFIG.PROCESSING_FEE_RATE;
    return Math.max(PAYMENT_CONFIG.MINIMUM_FEE, Math.min(fee, PAYMENT_CONFIG.MAXIMUM_FEE));
}

// Calculate Blockchain Fee
function calculateBlockchainFee(amount, blockchain) {
    const feeRate = PAYMENT_CONFIG.BLOCKCHAIN_FEES[blockchain] || 0.001;
    return amount * feeRate;
}

// Payment Processing Endpoint
app.post('/api/payments/process', async (req, res) => {
    try {
        const { amount, blockchain, facilityId, description } = req.body;
        
        // Validate input
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        
        if (!blockchain || !PAYMENT_CONFIG.BLOCKCHAIN_FEES[blockchain]) {
            return res.status(400).json({ error: 'Invalid blockchain' });
        }
        
        // Calculate fees
        const processingFee = calculateProcessingFee(amount);
        const blockchainFee = calculateBlockchainFee(amount, blockchain);
        const totalFees = processingFee + blockchainFee;
        const netAmount = amount - totalFees;
        
        // Update revenue metrics
        revenueMetrics.totalProcessingFees += processingFee;
        revenueMetrics.totalBlockchainFees += blockchainFee;
        revenueMetrics.totalTransactions += 1;
        revenueMetrics.totalVolume += amount;
        revenueMetrics.dailyRevenue += processingFee;
        revenueMetrics.revenueStreams.paymentProcessing += processingFee;
        
        // Transaction record
        const transaction = {
            id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            processingFee,
            blockchainFee,
            totalFees,
            netAmount,
            blockchain,
            facilityId,
            description,
            timestamp: new Date().toISOString(),
            status: 'completed'
        };
        
        console.log(`💰 Payment Processed: $${amount.toFixed(2)} | Fees: $${totalFees.toFixed(2)} | Net: $${netAmount.toFixed(2)}`);
        
        res.json({
            success: true,
            transaction,
            fees: {
                processing: processingFee,
                blockchain: blockchainFee,
                total: totalFees
            },
            netAmount
        });
        
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

// Revenue Analytics Endpoint
app.get('/api/revenue/analytics', (req, res) => {
    const analytics = {
        ...revenueMetrics,
        averageTransactionValue: revenueMetrics.totalVolume / revenueMetrics.totalTransactions || 0,
        averageProcessingFee: revenueMetrics.totalProcessingFees / revenueMetrics.totalTransactions || 0,
        processingFeeRate: (revenueMetrics.totalProcessingFees / revenueMetrics.totalVolume * 100).toFixed(2),
        projectedMonthlyRevenue: revenueMetrics.dailyRevenue * 30,
        mrr: Object.values(revenueMetrics.revenueStreams).reduce((sum, val) => sum + val, 0)
    };
    
    res.json(analytics);
});

// Facility Subscription Management
app.post('/api/facilities/subscribe', async (req, res) => {
    try {
        const { facilityId, plan, billingCycle } = req.body;
        
        const plans = {
            starter: { monthly: 299, yearly: 2990 },
            professional: { monthly: 799, yearly: 7990 },
            enterprise: { monthly: 2499, yearly: 24990 }
        };
        
        const selectedPlan = plans[plan];
        if (!selectedPlan) {
            return res.status(400).json({ error: 'Invalid plan' });
        }
        
        const monthlyPrice = billingCycle === 'yearly' ? selectedPlan.yearly / 12 : selectedPlan.monthly;
        
        // Update facility revenue
        revenueMetrics.revenueStreams.facilities += monthlyPrice;
        
        console.log(`🏥 Facility ${facilityId} subscribed to ${plan} plan - $${monthlyPrice}/month`);
        
        res.json({
            success: true,
            facilityId,
            plan,
            billingCycle,
            monthlyPrice,
            annualPrice: billingCycle === 'yearly' ? selectedPlan.yearly : selectedPlan.monthly * 12
        });
        
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: 'Subscription failed' });
    }
});

// Premium Features Billing
app.post('/api/premium/activate', async (req, res) => {
    try {
        const { facilityId, features } = req.body;
        
        const featurePrices = {
            advancedAnalytics: 199,
            aiInsights: 299,
            customReports: 149,
            prioritySupport: 399,
            apiAccess: 249
        };
        
        let monthlyPrice = 0;
        const activatedFeatures = [];
        
        features.forEach(feature => {
            if (featurePrices[feature]) {
                monthlyPrice += featurePrices[feature];
                activatedFeatures.push(feature);
            }
        });
        
        // Update premium revenue
        revenueMetrics.revenueStreams.premiumFeatures += monthlyPrice;
        
        console.log(`⭐ Premium features activated for ${facilityId} - $${monthlyPrice}/month`);
        
        res.json({
            success: true,
            facilityId,
            activatedFeatures,
            monthlyPrice
        });
        
    } catch (error) {
        console.error('Premium activation error:', error);
        res.status(500).json({ error: 'Premium activation failed' });
    }
});

// Revenue Streams Breakdown
app.get('/api/revenue/streams', (req, res) => {
    const total = Object.values(revenueMetrics.revenueStreams).reduce((sum, val) => sum + val, 0);
    
    const streams = Object.entries(revenueMetrics.revenueStreams).map(([stream, amount]) => ({
        name: stream.charAt(0).toUpperCase() + stream.slice(1).replace(/([A-Z])/g, ' $1'),
        amount,
        percentage: ((amount / total) * 100).toFixed(1)
    }));
    
    res.json({
        streams,
        total,
        growth: {
            daily: revenueMetrics.dailyRevenue,
            weekly: revenueMetrics.weeklyRevenue,
            monthly: revenueMetrics.monthlyRevenue
        }
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        revenueMetrics: {
            totalTransactions: revenueMetrics.totalTransactions,
            totalVolume: revenueMetrics.totalVolume,
            totalFees: revenueMetrics.totalProcessingFees + revenueMetrics.totalBlockchainFees
        }
    });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`💰 Payment Processing Server running on port ${PORT}`);
    console.log(`📊 Processing Fee Rate: ${(PAYMENT_CONFIG.PROCESSING_FEE_RATE * 100).toFixed(1)}%`);
    console.log(`💳 Ready to process payments and generate revenue!`);
});

// Reset daily revenue at midnight
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        revenueMetrics.dailyRevenue = 0;
        console.log('📅 Daily revenue reset');
    }
}, 60000); // Check every minute

module.exports = app;
