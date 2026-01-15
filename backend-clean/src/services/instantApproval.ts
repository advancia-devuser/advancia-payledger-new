import { logger } from '../middleware/errorHandler';
import { fraudDetection } from './fraudDetection';
import { paymentMonitoring } from './paymentMonitoring';

export class InstantApprovalService {
  private approvedTransactions: Map<string, ApprovedTransaction> = new Map();
  private pendingApprovals: Map<string, PendingApproval> = new Map();

  async processIncomingTransaction(params: {
    transactionId: string;
    userId: string;
    amount: number;
    currency: string;
    fromAddress: string;
    toAddress: string;
    network: string;
    txHash?: string;
  }): Promise<ApprovalResult> {
    try {
      logger.info('Processing incoming transaction for instant approval', {
        transactionId: params.transactionId,
        userId: params.userId,
        amount: params.amount,
      });

      const securityChecks = await this.performSecurityChecks(params);
      
      if (securityChecks.passed) {
        const approval = await this.approveInstantly(params);
        return approval;
      } else {
        const pending = await this.requireManualApproval(params, securityChecks.reasons);
        return pending;
      }
    } catch (error) {
      logger.error(error as Error, { transactionId: params.transactionId });
      throw error;
    }
  }

  private async performSecurityChecks(params: {
    transactionId: string;
    userId: string;
    amount: number;
    currency: string;
    fromAddress: string;
    toAddress: string;
    network: string;
  }): Promise<{ passed: boolean; reasons: string[] }> {
    const reasons: string[] = [];
    let passed = true;

    const fraudCheck = await fraudDetection.detectFraudulentTransaction({
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      destinationAddress: params.fromAddress,
      ip: 'system',
    });

    if (fraudCheck.isFraudulent) {
      passed = false;
      reasons.push(...fraudCheck.reasons);
    }

    const addressValidation = fraudDetection.validateCryptoAddress(
      params.fromAddress,
      params.network
    );

    if (!addressValidation.valid) {
      passed = false;
      reasons.push(addressValidation.reason || 'Invalid address format');
    }

    if (params.amount > 50000) {
      passed = false;
      reasons.push('Amount exceeds instant approval threshold');
    }

    const scamCheck = await fraudDetection.checkScamAddress(params.fromAddress);
    if (scamCheck) {
      passed = false;
      reasons.push('Source address flagged as potential scam');
    }

    return { passed, reasons };
  }

  private async approveInstantly(params: {
    transactionId: string;
    userId: string;
    amount: number;
    currency: string;
    fromAddress: string;
    toAddress: string;
    network: string;
    txHash?: string;
  }): Promise<ApprovalResult> {
    const approvedTx: ApprovedTransaction = {
      transactionId: params.transactionId,
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      network: params.network,
      txHash: params.txHash,
      status: 'approved',
      approvalType: 'instant',
      approvedAt: new Date(),
      availableImmediately: true,
      canConvert: true,
      canUseInternally: true,
      requiresApprovalForExternal: true,
    };

    this.approvedTransactions.set(params.transactionId, approvedTx);

    logger.info('Transaction instantly approved', {
      transactionId: params.transactionId,
      userId: params.userId,
      amount: params.amount,
    });

    return {
      approved: true,
      transactionId: params.transactionId,
      status: 'approved',
      approvalType: 'instant',
      availableImmediately: true,
      message: 'Transaction approved instantly. Funds available for immediate use.',
      timestamp: new Date(),
    };
  }

  private async requireManualApproval(
    params: {
      transactionId: string;
      userId: string;
      amount: number;
      currency: string;
      fromAddress: string;
      toAddress: string;
      network: string;
      txHash?: string;
    },
    reasons: string[]
  ): Promise<ApprovalResult> {
    const pendingApproval: PendingApproval = {
      transactionId: params.transactionId,
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      fromAddress: params.fromAddress,
      toAddress: params.toAddress,
      network: params.network,
      txHash: params.txHash,
      status: 'pending',
      reasons,
      createdAt: new Date(),
      requiresManualReview: true,
    };

    this.pendingApprovals.set(params.transactionId, pendingApproval);

    logger.warn('Transaction requires manual approval', {
      transactionId: params.transactionId,
      userId: params.userId,
      reasons,
    });

    return {
      approved: false,
      transactionId: params.transactionId,
      status: 'pending_approval',
      approvalType: 'manual',
      availableImmediately: false,
      message: 'Transaction requires manual approval. Reasons: ' + reasons.join(', '),
      timestamp: new Date(),
      reasons,
    };
  }

  async manualApprove(transactionId: string, approvedBy: string): Promise<boolean> {
    const pending = this.pendingApprovals.get(transactionId);
    if (!pending) {
      throw new Error('Pending approval not found');
    }

    const approvedTx: ApprovedTransaction = {
      transactionId: pending.transactionId,
      userId: pending.userId,
      amount: pending.amount,
      currency: pending.currency,
      fromAddress: pending.fromAddress,
      toAddress: pending.toAddress,
      network: pending.network,
      txHash: pending.txHash,
      status: 'approved',
      approvalType: 'manual',
      approvedAt: new Date(),
      approvedBy,
      availableImmediately: true,
      canConvert: true,
      canUseInternally: true,
      requiresApprovalForExternal: true,
    };

    this.approvedTransactions.set(transactionId, approvedTx);
    this.pendingApprovals.delete(transactionId);

    logger.info('Transaction manually approved', {
      transactionId,
      approvedBy,
    });

    return true;
  }

  async rejectTransaction(transactionId: string, rejectedBy: string, reason: string): Promise<boolean> {
    const pending = this.pendingApprovals.get(transactionId);
    if (!pending) {
      throw new Error('Pending approval not found');
    }

    this.pendingApprovals.delete(transactionId);

    logger.info('Transaction rejected', {
      transactionId,
      rejectedBy,
      reason,
    });

    return true;
  }

  getApprovedTransaction(transactionId: string): ApprovedTransaction | undefined {
    return this.approvedTransactions.get(transactionId);
  }

  getPendingApprovals(userId?: string): PendingApproval[] {
    const pending = Array.from(this.pendingApprovals.values());
    if (userId) {
      return pending.filter(p => p.userId === userId);
    }
    return pending;
  }

  getUserApprovedTransactions(userId: string): ApprovedTransaction[] {
    return Array.from(this.approvedTransactions.values()).filter(
      tx => tx.userId === userId
    );
  }

  isTransactionApproved(transactionId: string): boolean {
    return this.approvedTransactions.has(transactionId);
  }

  canUseImmediately(transactionId: string): boolean {
    const tx = this.approvedTransactions.get(transactionId);
    return tx?.availableImmediately || false;
  }

  canConvert(transactionId: string): boolean {
    const tx = this.approvedTransactions.get(transactionId);
    return tx?.canConvert || false;
  }

  requiresExternalApproval(transactionId: string): boolean {
    const tx = this.approvedTransactions.get(transactionId);
    return tx?.requiresApprovalForExternal || false;
  }
}

interface ApprovedTransaction {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  fromAddress: string;
  toAddress: string;
  network: string;
  txHash?: string;
  status: 'approved';
  approvalType: 'instant' | 'manual';
  approvedAt: Date;
  approvedBy?: string;
  availableImmediately: boolean;
  canConvert: boolean;
  canUseInternally: boolean;
  requiresApprovalForExternal: boolean;
}

interface PendingApproval {
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  fromAddress: string;
  toAddress: string;
  network: string;
  txHash?: string;
  status: 'pending';
  reasons: string[];
  createdAt: Date;
  requiresManualReview: boolean;
}

interface ApprovalResult {
  approved: boolean;
  transactionId: string;
  status: 'approved' | 'pending_approval' | 'rejected';
  approvalType: 'instant' | 'manual';
  availableImmediately: boolean;
  message: string;
  timestamp: Date;
  reasons?: string[];
}

export const instantApproval = new InstantApprovalService();
