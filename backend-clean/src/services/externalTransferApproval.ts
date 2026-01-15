import { logger } from '../middleware/errorHandler';
import { ledgerBalance } from './ledgerBalance';
import { fraudDetection } from './fraudDetection';

export class ExternalTransferApprovalService {
  private pendingTransfers: Map<string, PendingTransfer> = new Map();
  private approvalHistory: Map<string, ApprovalRecord[]> = new Map();
  private autoApprovalRules: Map<string, AutoApprovalRule> = new Map();

  async requestExternalTransfer(params: {
    userId: string;
    amount: number;
    currency: string;
    destinationAddress: string;
    network: string;
    memo?: string;
  }): Promise<TransferRequestResult> {
    try {
      const transferId = this.generateTransferId();

      const availableBalance = ledgerBalance.getAvailableBalance(params.userId, params.currency);
      if (availableBalance < params.amount) {
        throw new Error('Insufficient available balance');
      }

      const securityCheck = await this.performSecurityChecks(params);

      if (securityCheck.autoApprove) {
        return await this.autoApproveTransfer(transferId, params);
      }

      const pendingTransfer: PendingTransfer = {
        transferId,
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
        destinationAddress: params.destinationAddress,
        network: params.network,
        memo: params.memo,
        status: 'pending',
        requestedAt: new Date(),
        securityChecks: securityCheck.checks,
        riskScore: securityCheck.riskScore,
        requiresManualReview: securityCheck.requiresManualReview,
      };

      this.pendingTransfers.set(transferId, pendingTransfer);

      logger.info('External transfer requested', {
        transferId,
        userId: params.userId,
        amount: params.amount,
        currency: params.currency,
      });

      return {
        success: true,
        transferId,
        status: 'pending_approval',
        message: 'Transfer request submitted. Awaiting approval.',
        requiresApproval: true,
        estimatedApprovalTime: this.estimateApprovalTime(securityCheck.riskScore),
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        transferId: '',
        status: 'failed',
        message: (error as Error).message,
        requiresApproval: false,
      };
    }
  }

  private async performSecurityChecks(params: {
    userId: string;
    amount: number;
    currency: string;
    destinationAddress: string;
    network: string;
  }): Promise<SecurityCheckResult> {
    const checks: SecurityCheck[] = [];
    let riskScore = 0;
    let autoApprove = true;

    const addressValidation = fraudDetection.validateCryptoAddress(
      params.destinationAddress,
      params.network
    );
    checks.push({
      name: 'Address Validation',
      passed: addressValidation.valid,
      details: addressValidation.reason || 'Valid address format',
    });

    if (!addressValidation.valid) {
      riskScore += 50;
      autoApprove = false;
    }

    const scamCheck = await fraudDetection.checkScamAddress(params.destinationAddress);
    checks.push({
      name: 'Scam Address Check',
      passed: !scamCheck,
      details: scamCheck ? 'Address flagged as potential scam' : 'Address not flagged',
    });

    if (scamCheck) {
      riskScore += 100;
      autoApprove = false;
    }

    const fraudCheck = await fraudDetection.detectFraudulentTransaction({
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      destinationAddress: params.destinationAddress,
      ip: 'system',
    });
    checks.push({
      name: 'Fraud Detection',
      passed: !fraudCheck.isFraudulent,
      details: fraudCheck.reasons.join(', ') || 'No fraud indicators',
    });

    if (fraudCheck.isFraudulent) {
      riskScore += fraudCheck.riskScore;
      autoApprove = false;
    }

    const autoApprovalRule = this.checkAutoApprovalRules(params.userId, params.amount, params.currency);
    if (!autoApprovalRule.eligible) {
      autoApprove = false;
      riskScore += 20;
    }

    return {
      autoApprove: autoApprove && riskScore < 30,
      checks,
      riskScore,
      requiresManualReview: riskScore >= 70,
    };
  }

  private async autoApproveTransfer(
    transferId: string,
    params: {
      userId: string;
      amount: number;
      currency: string;
      destinationAddress: string;
      network: string;
      memo?: string;
    }
  ): Promise<TransferRequestResult> {
    const approvalRecord: ApprovalRecord = {
      transferId,
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      destinationAddress: params.destinationAddress,
      status: 'approved',
      approvalType: 'automatic',
      approvedAt: new Date(),
      approvedBy: 'system',
    };

    this.saveApprovalRecord(params.userId, approvalRecord);

    const debitResult = await ledgerBalance.debitLedger({
      userId: params.userId,
      amount: params.amount,
      currency: params.currency,
      transactionId: transferId,
      destination: 'external',
      requiresApproval: false,
      metadata: {
        destinationAddress: params.destinationAddress,
        network: params.network,
        memo: params.memo,
      },
    });

    if (!debitResult.success) {
      throw new Error('Failed to process transfer');
    }

    logger.info('External transfer auto-approved', {
      transferId,
      userId: params.userId,
      amount: params.amount,
    });

    return {
      success: true,
      transferId,
      status: 'approved',
      message: 'Transfer automatically approved and processed.',
      requiresApproval: false,
    };
  }

  async approveTransfer(transferId: string, approvedBy: string, notes?: string): Promise<ApprovalResult> {
    try {
      const transfer = this.pendingTransfers.get(transferId);
      if (!transfer) {
        throw new Error('Transfer not found');
      }

      if (transfer.status !== 'pending') {
        throw new Error(`Transfer already ${transfer.status}`);
      }

      const approvalRecord: ApprovalRecord = {
        transferId,
        userId: transfer.userId,
        amount: transfer.amount,
        currency: transfer.currency,
        destinationAddress: transfer.destinationAddress,
        status: 'approved',
        approvalType: 'manual',
        approvedAt: new Date(),
        approvedBy,
        notes,
      };

      this.saveApprovalRecord(transfer.userId, approvalRecord);

      const debitResult = await ledgerBalance.approveExternalTransfer(transferId, approvedBy);

      transfer.status = 'approved';
      transfer.approvedAt = new Date();
      transfer.approvedBy = approvedBy;

      logger.info('External transfer approved', {
        transferId,
        approvedBy,
        userId: transfer.userId,
      });

      return {
        success: true,
        transferId,
        status: 'approved',
        message: 'Transfer approved and processed.',
      };
    } catch (error) {
      logger.error(error as Error, { transferId });
      return {
        success: false,
        transferId,
        status: 'failed',
        message: (error as Error).message,
      };
    }
  }

  async rejectTransfer(transferId: string, rejectedBy: string, reason: string): Promise<ApprovalResult> {
    try {
      const transfer = this.pendingTransfers.get(transferId);
      if (!transfer) {
        throw new Error('Transfer not found');
      }

      if (transfer.status !== 'pending') {
        throw new Error(`Transfer already ${transfer.status}`);
      }

      const approvalRecord: ApprovalRecord = {
        transferId,
        userId: transfer.userId,
        amount: transfer.amount,
        currency: transfer.currency,
        destinationAddress: transfer.destinationAddress,
        status: 'rejected',
        approvalType: 'manual',
        approvedAt: new Date(),
        approvedBy: rejectedBy,
        notes: reason,
      };

      this.saveApprovalRecord(transfer.userId, approvalRecord);

      transfer.status = 'rejected';
      transfer.rejectedAt = new Date();
      transfer.rejectedBy = rejectedBy;
      transfer.rejectionReason = reason;

      logger.info('External transfer rejected', {
        transferId,
        rejectedBy,
        reason,
      });

      return {
        success: true,
        transferId,
        status: 'rejected',
        message: `Transfer rejected: ${reason}`,
      };
    } catch (error) {
      logger.error(error as Error, { transferId });
      return {
        success: false,
        transferId,
        status: 'failed',
        message: (error as Error).message,
      };
    }
  }

  private checkAutoApprovalRules(userId: string, amount: number, currency: string): {
    eligible: boolean;
    reason?: string;
  } {
    const userRule = this.autoApprovalRules.get(userId);
    
    if (!userRule) {
      if (amount <= 1000 && currency === 'USD') {
        return { eligible: true };
      }
      return { eligible: false, reason: 'Amount exceeds default auto-approval limit' };
    }

    if (amount > userRule.maxAmount) {
      return { eligible: false, reason: 'Amount exceeds user auto-approval limit' };
    }

    if (!userRule.allowedCurrencies.includes(currency)) {
      return { eligible: false, reason: 'Currency not in auto-approval list' };
    }

    return { eligible: true };
  }

  setAutoApprovalRule(userId: string, rule: AutoApprovalRule): void {
    this.autoApprovalRules.set(userId, rule);
    logger.info('Auto-approval rule set', { userId, maxAmount: rule.maxAmount });
  }

  private generateTransferId(): string {
    return `ext_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private saveApprovalRecord(userId: string, record: ApprovalRecord): void {
    const history = this.approvalHistory.get(userId) || [];
    history.push(record);
    this.approvalHistory.set(userId, history);
  }

  private estimateApprovalTime(riskScore: number): string {
    if (riskScore < 30) return '5-15 minutes';
    if (riskScore < 70) return '15-30 minutes';
    return '30-60 minutes';
  }

  getPendingTransfers(userId?: string): PendingTransfer[] {
    const pending = Array.from(this.pendingTransfers.values()).filter(
      t => t.status === 'pending'
    );
    if (userId) {
      return pending.filter(t => t.userId === userId);
    }
    return pending;
  }

  getTransferStatus(transferId: string): PendingTransfer | undefined {
    return this.pendingTransfers.get(transferId);
  }

  getApprovalHistory(userId: string, limit: number = 50): ApprovalRecord[] {
    const history = this.approvalHistory.get(userId) || [];
    return history.slice(-limit).reverse();
  }
}

interface PendingTransfer {
  transferId: string;
  userId: string;
  amount: number;
  currency: string;
  destinationAddress: string;
  network: string;
  memo?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  securityChecks: SecurityCheck[];
  riskScore: number;
  requiresManualReview: boolean;
}

interface SecurityCheck {
  name: string;
  passed: boolean;
  details: string;
}

interface SecurityCheckResult {
  autoApprove: boolean;
  checks: SecurityCheck[];
  riskScore: number;
  requiresManualReview: boolean;
}

interface TransferRequestResult {
  success: boolean;
  transferId: string;
  status: 'pending_approval' | 'approved' | 'failed';
  message: string;
  requiresApproval: boolean;
  estimatedApprovalTime?: string;
}

interface ApprovalResult {
  success: boolean;
  transferId: string;
  status: 'approved' | 'rejected' | 'failed';
  message: string;
}

interface ApprovalRecord {
  transferId: string;
  userId: string;
  amount: number;
  currency: string;
  destinationAddress: string;
  status: 'approved' | 'rejected';
  approvalType: 'automatic' | 'manual';
  approvedAt: Date;
  approvedBy: string;
  notes?: string;
}

interface AutoApprovalRule {
  maxAmount: number;
  allowedCurrencies: string[];
  dailyLimit?: number;
}

export const externalTransferApproval = new ExternalTransferApprovalService();
