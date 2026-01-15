import { logger } from '../middleware/errorHandler';
import { instantApproval } from './instantApproval';
import { ledgerBalance } from './ledgerBalance';
import { currencyConversion } from './currencyConversion';
import { externalTransferApproval } from './externalTransferApproval';
import { addressGeneration } from './addressGeneration';
import { paymentMonitoring } from './paymentMonitoring';

export class TransactionRouterService {
  async handleIncomingTransaction(params: {
    userId: string;
    amount: number;
    currency: string;
    fromAddress: string;
    toAddress: string;
    network: string;
    txHash?: string;
    provider: 'stripe' | 'nowpayments' | 'alchemy';
  }): Promise<IncomingTransactionResult> {
    try {
      const transactionId = this.generateTransactionId();

      logger.info('Routing incoming transaction', {
        transactionId,
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
      });

      const monitoringResult = await paymentMonitoring.monitorPayment(
        transactionId,
        params.provider
      );

      if (monitoringResult.status !== 'completed') {
        throw new Error(`Payment monitoring failed: ${monitoringResult.failureReason}`);
      }

      const approvalResult = await instantApproval.processIncomingTransaction({
        transactionId,
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        network: params.network,
        txHash: params.txHash,
      });

      if (approvalResult.approved) {
        const creditResult = await ledgerBalance.creditLedger({
          userId: params.userId,
          amount: params.amount,
          currency: params.currency,
          transactionId,
          source: 'incoming',
          metadata: {
            fromAddress: params.fromAddress,
            toAddress: params.toAddress,
            network: params.network,
            txHash: params.txHash,
            provider: params.provider,
          },
        });

        if (!creditResult.success) {
          throw new Error('Failed to credit ledger');
        }

        logger.info('Incoming transaction processed successfully', {
          transactionId,
          userId: params.userId,
          amount: params.amount,
        });

        return {
          success: true,
          transactionId,
          status: 'completed',
          approvalType: approvalResult.approvalType,
          availableImmediately: true,
          canConvert: true,
          canUseInternally: true,
          requiresApprovalForExternal: true,
          message: 'Transaction approved. Funds available immediately for use and conversion.',
        };
      } else {
        logger.info('Incoming transaction pending approval', {
          transactionId,
          userId: params.userId,
        });

        return {
          success: true,
          transactionId,
          status: 'pending_approval',
          approvalType: 'manual',
          availableImmediately: false,
          canConvert: false,
          canUseInternally: false,
          requiresApprovalForExternal: true,
          message: approvalResult.message,
          pendingReasons: approvalResult.reasons,
        };
      }
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        approvalType: 'instant',
        availableImmediately: false,
        canConvert: false,
        canUseInternally: false,
        requiresApprovalForExternal: true,
        message: (error as Error).message,
      };
    }
  }

  async handleInternalTransfer(params: {
    fromUserId: string;
    toUserId: string;
    amount: number;
    currency: string;
    memo?: string;
  }): Promise<TransferResult> {
    try {
      const transactionId = this.generateTransactionId();

      logger.info('Processing internal transfer', {
        transactionId,
        from: params.fromUserId,
        to: params.toUserId,
        amount: params.amount,
      });

      const transferResult = await ledgerBalance.internalTransfer({
        fromUserId: params.fromUserId,
        toUserId: params.toUserId,
        amount: params.amount,
        currency: params.currency,
        transactionId,
      });

      if (!transferResult.success) {
        throw new Error(transferResult.error || 'Internal transfer failed');
      }

      logger.info('Internal transfer completed', {
        transactionId,
        from: params.fromUserId,
        to: params.toUserId,
      });

      return {
        success: true,
        transactionId,
        status: 'completed',
        message: 'Internal transfer completed successfully. No approval required.',
      };
    } catch (error) {
      logger.error(error as Error, { fromUserId: params.fromUserId });
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: (error as Error).message,
      };
    }
  }

  async handleCurrencyConversion(params: {
    userId: string;
    fromCurrency: string;
    toCurrency: string;
    amount: number;
  }): Promise<ConversionResult> {
    try {
      logger.info('Processing currency conversion', {
        userId: params.userId,
        from: params.fromCurrency,
        to: params.toCurrency,
        amount: params.amount,
      });

      const conversionResult = await ledgerBalance.convertInLedger({
        userId: params.userId,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        amount: params.amount,
      });

      if (!conversionResult.success) {
        throw new Error(conversionResult.error || 'Conversion failed');
      }

      logger.info('Currency conversion completed', {
        userId: params.userId,
        conversionId: conversionResult.conversionId,
      });

      return {
        success: true,
        conversionId: conversionResult.conversionId,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: conversionResult.toAmount,
        rate: conversionResult.rate,
        fee: conversionResult.fee,
        message: 'Conversion completed successfully. Funds available immediately.',
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        conversionId: '',
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: 0,
        rate: 0,
        fee: 0,
        message: (error as Error).message,
      };
    }
  }

  async handleExternalTransfer(params: {
    userId: string;
    amount: number;
    currency: string;
    destinationAddress: string;
    network: string;
    memo?: string;
  }): Promise<ExternalTransferResult> {
    try {
      logger.info('Processing external transfer request', {
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
        destinationAddress: params.destinationAddress,
      });

      const requestResult = await externalTransferApproval.requestExternalTransfer({
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
        destinationAddress: params.destinationAddress,
        network: params.network,
        memo: params.memo,
      });

      if (!requestResult.success) {
        throw new Error(requestResult.message);
      }

      logger.info('External transfer request submitted', {
        transferId: requestResult.transferId,
        userId: params.userId,
        requiresApproval: requestResult.requiresApproval,
      });

      return {
        success: true,
        transferId: requestResult.transferId,
        status: requestResult.status,
        requiresApproval: requestResult.requiresApproval,
        message: requestResult.message,
        estimatedApprovalTime: requestResult.estimatedApprovalTime,
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        transferId: '',
        status: 'failed',
        requiresApproval: false,
        message: (error as Error).message,
      };
    }
  }

  async generateDepositAddress(params: {
    userId: string;
    network: 'ethereum' | 'bitcoin' | 'tron' | 'polygon' | 'bsc';
  }): Promise<AddressGenerationResult> {
    try {
      logger.info('Generating deposit address', {
        userId: params.userId,
        network: params.network,
      });

      const address = await addressGeneration.generateAddress({
        userId: params.userId,
        network: params.network,
        purpose: 'deposit',
      });

      logger.info('Deposit address generated', {
        userId: params.userId,
        network: params.network,
        address: address.address,
      });

      return {
        success: true,
        addressId: address.id,
        address: address.address,
        network: params.network,
        message: 'Deposit address generated successfully.',
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        addressId: '',
        address: '',
        network: params.network,
        message: (error as Error).message,
      };
    }
  }

  async getUserDashboard(userId: string): Promise<UserDashboard> {
    try {
      const balances = ledgerBalance.getAllBalances(userId);
      const ledger = await ledgerBalance.getUserLedger(userId);
      const pendingApprovals = instantApproval.getPendingApprovals(userId);
      const pendingTransfers = externalTransferApproval.getPendingTransfers(userId);
      const addresses = addressGeneration.getUserAddresses(userId);
      const transactionHistory = ledgerBalance.getTransactionHistory(userId, 20);
      const conversionHistory = currencyConversion.getConversionHistory(userId, 20);

      const balanceArray: BalanceInfo[] = [];
      for (const [currency, amount] of balances.entries()) {
        const frozen = ledger.frozenBalances.get(currency) || 0;
        balanceArray.push({
          currency,
          total: amount,
          available: amount - frozen,
          frozen,
        });
      }

      return {
        userId,
        balances: balanceArray,
        totalValueUSD: ledger.totalValueUSD,
        pendingIncoming: pendingApprovals.length,
        pendingOutgoing: pendingTransfers.length,
        depositAddresses: addresses.map(a => ({
          network: a.network,
          address: a.address,
          balance: a.balance,
        })),
        recentTransactions: transactionHistory.slice(0, 10),
        recentConversions: conversionHistory.slice(0, 10),
        capabilities: {
          canReceiveInstantly: true,
          canConvertInLedger: true,
          canTransferInternally: true,
          externalTransfersRequireApproval: true,
        },
      };
    } catch (error) {
      logger.error(error as Error, { userId });
      throw error;
    }
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  async getTransactionRules(): Promise<TransactionRules> {
    return {
      incomingTransactions: {
        instantApproval: true,
        availableImmediately: true,
        canConvertWhileInLedger: true,
        canUseInternally: true,
        securityChecks: [
          'Address validation',
          'Fraud detection',
          'Amount verification',
          'Scam address check',
        ],
      },
      internalTransfers: {
        requiresApproval: false,
        instantProcessing: true,
        noFees: true,
      },
      currencyConversion: {
        availableInLedger: true,
        noFeesForLedgerBalance: true,
        instantConversion: true,
        supportedCurrencies: currencyConversion.getSupportedCurrencies(),
      },
      externalTransfers: {
        requiresApproval: true,
        autoApprovalThreshold: 1000,
        autoApprovalCurrency: 'USD',
        securityChecks: [
          'Balance verification',
          'Address validation',
          'Fraud detection',
          'Scam address check',
          'Risk scoring',
        ],
        estimatedApprovalTime: '5-60 minutes',
      },
    };
  }
}

interface IncomingTransactionResult {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'pending_approval' | 'failed';
  approvalType: 'instant' | 'manual';
  availableImmediately: boolean;
  canConvert: boolean;
  canUseInternally: boolean;
  requiresApprovalForExternal: boolean;
  message: string;
  pendingReasons?: string[];
}

interface TransferResult {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'failed';
  message: string;
}

interface ConversionResult {
  success: boolean;
  conversionId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  message: string;
}

interface ExternalTransferResult {
  success: boolean;
  transferId: string;
  status: 'pending_approval' | 'approved' | 'failed';
  requiresApproval: boolean;
  message: string;
  estimatedApprovalTime?: string;
}

interface AddressGenerationResult {
  success: boolean;
  addressId: string;
  address: string;
  network: string;
  message: string;
}

interface BalanceInfo {
  currency: string;
  total: number;
  available: number;
  frozen: number;
}

interface UserDashboard {
  userId: string;
  balances: BalanceInfo[];
  totalValueUSD: number;
  pendingIncoming: number;
  pendingOutgoing: number;
  depositAddresses: Array<{
    network: string;
    address: string;
    balance: string;
  }>;
  recentTransactions: any[];
  recentConversions: any[];
  capabilities: {
    canReceiveInstantly: boolean;
    canConvertInLedger: boolean;
    canTransferInternally: boolean;
    externalTransfersRequireApproval: boolean;
  };
}

interface TransactionRules {
  incomingTransactions: {
    instantApproval: boolean;
    availableImmediately: boolean;
    canConvertWhileInLedger: boolean;
    canUseInternally: boolean;
    securityChecks: string[];
  };
  internalTransfers: {
    requiresApproval: boolean;
    instantProcessing: boolean;
    noFees: boolean;
  };
  currencyConversion: {
    availableInLedger: boolean;
    noFeesForLedgerBalance: boolean;
    instantConversion: boolean;
    supportedCurrencies: string[];
  };
  externalTransfers: {
    requiresApproval: boolean;
    autoApprovalThreshold: number;
    autoApprovalCurrency: string;
    securityChecks: string[];
    estimatedApprovalTime: string;
  };
}

export const transactionRouter = new TransactionRouterService();
