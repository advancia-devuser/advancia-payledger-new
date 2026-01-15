import { logger } from '../middleware/errorHandler';
import { instantApproval } from './instantApproval';
import { currencyConversion } from './currencyConversion';

export class LedgerBalanceService {
  private ledgerBalances: Map<string, UserLedger> = new Map();
  private transactionLogs: Map<string, LedgerTransaction[]> = new Map();

  async getUserLedger(userId: string): Promise<UserLedger> {
    let ledger = this.ledgerBalances.get(userId);
    
    if (!ledger) {
      ledger = {
        userId,
        balances: new Map(),
        totalValueUSD: 0,
        lastUpdated: new Date(),
        frozenBalances: new Map(),
      };
      this.ledgerBalances.set(userId, ledger);
    }

    return ledger;
  }

  async creditLedger(params: {
    userId: string;
    amount: number;
    currency: string;
    transactionId: string;
    source: 'incoming' | 'conversion' | 'internal_transfer';
    metadata?: any;
  }): Promise<LedgerOperationResult> {
    try {
      const ledger = await this.getUserLedger(params.userId);
      
      const currentBalance = ledger.balances.get(params.currency) || 0;
      const newBalance = currentBalance + params.amount;
      ledger.balances.set(params.currency, newBalance);
      ledger.lastUpdated = new Date();

      await this.updateTotalValue(ledger);

      const transaction: LedgerTransaction = {
        transactionId: params.transactionId,
        userId: params.userId,
        type: 'credit',
        amount: params.amount,
        currency: params.currency,
        balanceAfter: newBalance,
        source: params.source,
        timestamp: new Date(),
        metadata: params.metadata,
      };

      this.logTransaction(params.userId, transaction);

      logger.info('Ledger credited', {
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
        newBalance,
      });

      return {
        success: true,
        userId: params.userId,
        currency: params.currency,
        amount: params.amount,
        balanceAfter: newBalance,
        transactionId: params.transactionId,
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        userId: params.userId,
        currency: params.currency,
        amount: params.amount,
        balanceAfter: 0,
        transactionId: params.transactionId,
        error: (error as Error).message,
      };
    }
  }

  async debitLedger(params: {
    userId: string;
    amount: number;
    currency: string;
    transactionId: string;
    destination: 'external' | 'conversion' | 'internal_transfer';
    requiresApproval?: boolean;
    metadata?: any;
  }): Promise<LedgerOperationResult> {
    try {
      const ledger = await this.getUserLedger(params.userId);
      const currentBalance = ledger.balances.get(params.currency) || 0;

      if (currentBalance < params.amount) {
        throw new Error('Insufficient balance');
      }

      if (params.destination === 'external' && params.requiresApproval !== false) {
        return await this.handleExternalTransferRequest(params);
      }

      const newBalance = currentBalance - params.amount;
      ledger.balances.set(params.currency, newBalance);
      ledger.lastUpdated = new Date();

      await this.updateTotalValue(ledger);

      const transaction: LedgerTransaction = {
        transactionId: params.transactionId,
        userId: params.userId,
        type: 'debit',
        amount: params.amount,
        currency: params.currency,
        balanceAfter: newBalance,
        destination: params.destination,
        timestamp: new Date(),
        metadata: params.metadata,
      };

      this.logTransaction(params.userId, transaction);

      logger.info('Ledger debited', {
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
        newBalance,
      });

      return {
        success: true,
        userId: params.userId,
        currency: params.currency,
        amount: params.amount,
        balanceAfter: newBalance,
        transactionId: params.transactionId,
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        userId: params.userId,
        currency: params.currency,
        amount: params.amount,
        balanceAfter: 0,
        transactionId: params.transactionId,
        error: (error as Error).message,
      };
    }
  }

  private async handleExternalTransferRequest(params: {
    userId: string;
    amount: number;
    currency: string;
    transactionId: string;
    destination: string;
    metadata?: any;
  }): Promise<LedgerOperationResult> {
    const ledger = await this.getUserLedger(params.userId);
    const currentBalance = ledger.balances.get(params.currency) || 0;

    const frozenAmount = ledger.frozenBalances.get(params.currency) || 0;
    ledger.frozenBalances.set(params.currency, frozenAmount + params.amount);

    logger.info('External transfer pending approval', {
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      transactionId: params.transactionId,
    });

    return {
      success: true,
      userId: params.userId,
      currency: params.currency,
      amount: params.amount,
      balanceAfter: currentBalance,
      transactionId: params.transactionId,
      pendingApproval: true,
      message: 'External transfer requires approval. Funds frozen until approved.',
    };
  }

  async convertInLedger(params: {
    userId: string;
    fromCurrency: string;
    toCurrency: string;
    amount: number;
  }): Promise<ConversionResult> {
    try {
      const ledger = await this.getUserLedger(params.userId);
      const currentBalance = ledger.balances.get(params.fromCurrency) || 0;

      if (currentBalance < params.amount) {
        throw new Error('Insufficient balance for conversion');
      }

      const conversionResult = await currencyConversion.convertCurrency({
        userId: params.userId,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        amount: params.amount,
        ledgerBalance: true,
      });

      if (!conversionResult.success) {
        throw new Error(conversionResult.error || 'Conversion failed');
      }

      const debitResult = await this.debitLedger({
        userId: params.userId,
        amount: params.amount,
        currency: params.fromCurrency,
        transactionId: conversionResult.conversionId,
        destination: 'conversion',
        requiresApproval: false,
      });

      if (!debitResult.success) {
        throw new Error('Failed to debit source currency');
      }

      const creditResult = await this.creditLedger({
        userId: params.userId,
        amount: conversionResult.toAmount,
        currency: params.toCurrency,
        transactionId: conversionResult.conversionId,
        source: 'conversion',
      });

      if (!creditResult.success) {
        throw new Error('Failed to credit destination currency');
      }

      logger.info('In-ledger conversion completed', {
        userId: params.userId,
        from: params.fromCurrency,
        to: params.toCurrency,
        amount: params.amount,
        converted: conversionResult.toAmount,
      });

      return {
        success: true,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: conversionResult.toAmount,
        rate: conversionResult.rate,
        fee: conversionResult.fee,
        conversionId: conversionResult.conversionId,
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: 0,
        rate: 0,
        fee: 0,
        conversionId: '',
        error: (error as Error).message,
      };
    }
  }

  async internalTransfer(params: {
    fromUserId: string;
    toUserId: string;
    amount: number;
    currency: string;
    transactionId: string;
  }): Promise<TransferResult> {
    try {
      const debitResult = await this.debitLedger({
        userId: params.fromUserId,
        amount: params.amount,
        currency: params.currency,
        transactionId: params.transactionId,
        destination: 'internal_transfer',
        requiresApproval: false,
      });

      if (!debitResult.success) {
        throw new Error('Failed to debit sender');
      }

      const creditResult = await this.creditLedger({
        userId: params.toUserId,
        amount: params.amount,
        currency: params.currency,
        transactionId: params.transactionId,
        source: 'internal_transfer',
      });

      if (!creditResult.success) {
        await this.creditLedger({
          userId: params.fromUserId,
          amount: params.amount,
          currency: params.currency,
          transactionId: `${params.transactionId}_rollback`,
          source: 'internal_transfer',
        });
        throw new Error('Failed to credit recipient - transaction rolled back');
      }

      logger.info('Internal transfer completed', {
        from: params.fromUserId,
        to: params.toUserId,
        amount: params.amount,
        currency: params.currency,
      });

      return {
        success: true,
        fromUserId: params.fromUserId,
        toUserId: params.toUserId,
        amount: params.amount,
        currency: params.currency,
        transactionId: params.transactionId,
      };
    } catch (error) {
      logger.error(error as Error, { fromUserId: params.fromUserId });
      return {
        success: false,
        fromUserId: params.fromUserId,
        toUserId: params.toUserId,
        amount: params.amount,
        currency: params.currency,
        transactionId: params.transactionId,
        error: (error as Error).message,
      };
    }
  }

  async approveExternalTransfer(transactionId: string, approvedBy: string): Promise<boolean> {
    const transaction = this.findTransactionById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const ledger = await this.getUserLedger(transaction.userId);
    const frozenAmount = ledger.frozenBalances.get(transaction.currency) || 0;
    
    if (frozenAmount < transaction.amount) {
      throw new Error('Insufficient frozen balance');
    }

    ledger.frozenBalances.set(transaction.currency, frozenAmount - transaction.amount);
    
    const currentBalance = ledger.balances.get(transaction.currency) || 0;
    ledger.balances.set(transaction.currency, currentBalance - transaction.amount);
    ledger.lastUpdated = new Date();

    await this.updateTotalValue(ledger);

    logger.info('External transfer approved', {
      transactionId,
      approvedBy,
      userId: transaction.userId,
    });

    return true;
  }

  private async updateTotalValue(ledger: UserLedger): Promise<void> {
    let totalUSD = 0;

    for (const [currency, balance] of ledger.balances.entries()) {
      if (currency === 'USD') {
        totalUSD += balance;
      } else {
        const rate = currencyConversion.getCurrentRate(currency, 'USD');
        if (rate) {
          totalUSD += balance * rate;
        }
      }
    }

    ledger.totalValueUSD = totalUSD;
  }

  private logTransaction(userId: string, transaction: LedgerTransaction): void {
    const logs = this.transactionLogs.get(userId) || [];
    logs.push(transaction);
    this.transactionLogs.set(userId, logs);
  }

  private findTransactionById(transactionId: string): LedgerTransaction | null {
    for (const logs of this.transactionLogs.values()) {
      const transaction = logs.find(tx => tx.transactionId === transactionId);
      if (transaction) return transaction;
    }
    return null;
  }

  getBalance(userId: string, currency: string): number {
    const ledger = this.ledgerBalances.get(userId);
    return ledger?.balances.get(currency) || 0;
  }

  getAllBalances(userId: string): Map<string, number> {
    const ledger = this.ledgerBalances.get(userId);
    return ledger?.balances || new Map();
  }

  getTransactionHistory(userId: string, limit: number = 50): LedgerTransaction[] {
    const logs = this.transactionLogs.get(userId) || [];
    return logs.slice(-limit).reverse();
  }

  getAvailableBalance(userId: string, currency: string): number {
    const ledger = this.ledgerBalances.get(userId);
    if (!ledger) return 0;

    const total = ledger.balances.get(currency) || 0;
    const frozen = ledger.frozenBalances.get(currency) || 0;
    return total - frozen;
  }
}

interface UserLedger {
  userId: string;
  balances: Map<string, number>;
  totalValueUSD: number;
  lastUpdated: Date;
  frozenBalances: Map<string, number>;
}

interface LedgerTransaction {
  transactionId: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  balanceAfter: number;
  source?: 'incoming' | 'conversion' | 'internal_transfer';
  destination?: 'external' | 'conversion' | 'internal_transfer';
  timestamp: Date;
  metadata?: any;
}

interface LedgerOperationResult {
  success: boolean;
  userId: string;
  currency: string;
  amount: number;
  balanceAfter: number;
  transactionId: string;
  pendingApproval?: boolean;
  message?: string;
  error?: string;
}

interface ConversionResult {
  success: boolean;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  conversionId: string;
  error?: string;
}

interface TransferResult {
  success: boolean;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  transactionId: string;
  error?: string;
}

export const ledgerBalance = new LedgerBalanceService();
