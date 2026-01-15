import { Router, Request, Response } from 'express';
import { transactionRouter } from '../services/transactionRouter';
import { ledgerBalance } from '../services/ledgerBalance';
import { currencyConversion } from '../services/currencyConversion';
import { externalTransferApproval } from '../services/externalTransferApproval';
import { addressGeneration } from '../services/addressGeneration';
import { instantApproval } from '../services/instantApproval';
import { logger } from '../middleware/errorHandler';

const router = Router();

router.post('/incoming', async (req: Request, res: Response) => {
  try {
    const { userId, amount, currency, fromAddress, toAddress, network, txHash, provider } = req.body;

    if (!userId || !amount || !currency || !fromAddress || !toAddress || !network || !provider) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await transactionRouter.handleIncomingTransaction({
      userId,
      amount: parseFloat(amount),
      currency,
      fromAddress,
      toAddress,
      network,
      txHash,
      provider,
    });

    res.json(result);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/incoming' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/transfer/internal', async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, amount, currency, memo } = req.body;

    if (!fromUserId || !toUserId || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await transactionRouter.handleInternalTransfer({
      fromUserId,
      toUserId,
      amount: parseFloat(amount),
      currency,
      memo,
    });

    res.json(result);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/transfer/internal' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/transfer/external', async (req: Request, res: Response) => {
  try {
    const { userId, amount, currency, destinationAddress, network, memo } = req.body;

    if (!userId || !amount || !currency || !destinationAddress || !network) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await transactionRouter.handleExternalTransfer({
      userId,
      amount: parseFloat(amount),
      currency,
      destinationAddress,
      network,
      memo,
    });

    res.json(result);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/transfer/external' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/transfer/external/:transferId/approve', async (req: Request, res: Response) => {
  try {
    const { transferId } = req.params;
    const { approvedBy, notes } = req.body;

    if (!approvedBy) {
      return res.status(400).json({ error: 'approvedBy is required' });
    }

    const result = await externalTransferApproval.approveTransfer(transferId, approvedBy, notes);
    res.json(result);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/transfer/external/approve' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/transfer/external/:transferId/reject', async (req: Request, res: Response) => {
  try {
    const { transferId } = req.params;
    const { rejectedBy, reason } = req.body;

    if (!rejectedBy || !reason) {
      return res.status(400).json({ error: 'rejectedBy and reason are required' });
    }

    const result = await externalTransferApproval.rejectTransfer(transferId, rejectedBy, reason);
    res.json(result);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/transfer/external/reject' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/transfer/external/pending', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const pending = externalTransferApproval.getPendingTransfers(userId as string);
    res.json({ pending });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/transfer/external/pending' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/convert', async (req: Request, res: Response) => {
  try {
    const { userId, fromCurrency, toCurrency, amount } = req.body;

    if (!userId || !fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await transactionRouter.handleCurrencyConversion({
      userId,
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
    });

    res.json(result);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/convert' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/convert/estimate', async (req: Request, res: Response) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const estimate = await currencyConversion.estimateConversion(
      from as string,
      to as string,
      parseFloat(amount as string)
    );

    res.json(estimate);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/convert/estimate' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/convert/rates', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const rate = currencyConversion.getCurrentRate(from as string, to as string);
    
    if (rate === null) {
      return res.status(404).json({ error: 'Conversion rate not available' });
    }

    res.json({ from, to, rate });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/convert/rates' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/convert/currencies', async (req: Request, res: Response) => {
  try {
    const currencies = currencyConversion.getSupportedCurrencies();
    res.json({ currencies });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/convert/currencies' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/address/generate', async (req: Request, res: Response) => {
  try {
    const { userId, network } = req.body;

    if (!userId || !network) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await transactionRouter.generateDepositAddress({
      userId,
      network,
    });

    res.json(result);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/address/generate' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/address/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const addresses = addressGeneration.getUserAddresses(userId);
    res.json({ addresses });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/address/:userId' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/balance/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { currency } = req.query;

    if (currency) {
      const balance = ledgerBalance.getBalance(userId, currency as string);
      const available = ledgerBalance.getAvailableBalance(userId, currency as string);
      res.json({ 
        currency, 
        balance, 
        available,
        frozen: balance - available 
      });
    } else {
      const balances = ledgerBalance.getAllBalances(userId);
      const balanceArray = Array.from(balances.entries()).map(([curr, amount]) => ({
        currency: curr,
        balance: amount,
        available: ledgerBalance.getAvailableBalance(userId, curr),
        frozen: amount - ledgerBalance.getAvailableBalance(userId, curr),
      }));
      res.json({ balances: balanceArray });
    }
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/balance/:userId' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/dashboard/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const dashboard = await transactionRouter.getUserDashboard(userId);
    res.json(dashboard);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/dashboard/:userId' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/transactions/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    const transactions = ledgerBalance.getTransactionHistory(
      userId, 
      limit ? parseInt(limit as string) : 50
    );
    
    res.json({ transactions });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/transactions/:userId' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/conversions/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    const conversions = currencyConversion.getConversionHistory(
      userId,
      limit ? parseInt(limit as string) : 50
    );
    
    res.json({ conversions });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/conversions/:userId' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/approvals/pending/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const pendingApprovals = instantApproval.getPendingApprovals(userId);
    res.json({ pendingApprovals });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/approvals/pending/:userId' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/approvals/:transactionId/approve', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { approvedBy } = req.body;

    if (!approvedBy) {
      return res.status(400).json({ error: 'approvedBy is required' });
    }

    const result = await instantApproval.manualApprove(transactionId, approvedBy);
    res.json({ success: result, message: 'Transaction approved' });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/approvals/approve' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/approvals/:transactionId/reject', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const { rejectedBy, reason } = req.body;

    if (!rejectedBy || !reason) {
      return res.status(400).json({ error: 'rejectedBy and reason are required' });
    }

    const result = await instantApproval.rejectTransaction(transactionId, rejectedBy, reason);
    res.json({ success: result, message: 'Transaction rejected' });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/approvals/reject' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/rules', async (req: Request, res: Response) => {
  try {
    const rules = await transactionRouter.getTransactionRules();
    res.json(rules);
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/rules' });
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/auto-approval-rule', async (req: Request, res: Response) => {
  try {
    const { userId, maxAmount, allowedCurrencies, dailyLimit } = req.body;

    if (!userId || !maxAmount || !allowedCurrencies) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    externalTransferApproval.setAutoApprovalRule(userId, {
      maxAmount: parseFloat(maxAmount),
      allowedCurrencies,
      dailyLimit: dailyLimit ? parseFloat(dailyLimit) : undefined,
    });

    res.json({ success: true, message: 'Auto-approval rule set' });
  } catch (error) {
    logger.error(error as Error, { route: '/ledger/auto-approval-rule' });
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
