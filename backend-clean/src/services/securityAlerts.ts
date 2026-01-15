import { logger } from '../middleware/errorHandler';

// Real-time security alert system
export class SecurityAlertService {
  private alerts: SecurityAlert[] = [];
  private alertSubscribers: Map<string, AlertCallback[]> = new Map();

  // Send real-time security alert
  async sendAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp'>): Promise<void> {
    const fullAlert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...alert,
    };

    this.alerts.push(fullAlert);
    logger.warn('Security alert triggered', fullAlert);

    // Notify subscribers
    const subscribers = this.alertSubscribers.get(alert.type) || [];
    subscribers.forEach(callback => callback(fullAlert));

    // Store in database for audit
    await this.storeAlert(fullAlert);

    // Send notifications based on severity
    if (alert.severity === 'critical') {
      await this.sendCriticalNotification(fullAlert);
    }
  }

  // Subscribe to alerts
  subscribe(type: AlertType, callback: AlertCallback): void {
    const subscribers = this.alertSubscribers.get(type) || [];
    subscribers.push(callback);
    this.alertSubscribers.set(type, subscribers);
  }

  // Store alert in database
  private async storeAlert(alert: SecurityAlert): Promise<void> {
    // In production, store in database
    logger.info('Alert stored', { alertId: alert.id });
  }

  // Send critical notification to admins
  private async sendCriticalNotification(alert: SecurityAlert): Promise<void> {
    // In production:
    // - Send email to admins
    // - Send SMS
    // - Trigger Slack/Discord webhook
    // - Create high-priority ticket
    
    logger.error(new Error('CRITICAL SECURITY ALERT'), alert);
  }

  // Get recent alerts
  getRecentAlerts(limit: number = 50): SecurityAlert[] {
    return this.alerts.slice(-limit);
  }

  // Get alerts by type
  getAlertsByType(type: AlertType): SecurityAlert[] {
    return this.alerts.filter(alert => alert.type === type);
  }

  // Get alerts by severity
  getAlertsBySeverity(severity: AlertSeverity): SecurityAlert[] {
    return this.alerts.filter(alert => alert.severity === severity);
  }
}

// Alert types
export type AlertType = 
  | 'bot_detected'
  | 'fraud_attempt'
  | 'suspicious_transaction'
  | 'payment_failure'
  | 'destination_error'
  | 'amount_mismatch'
  | 'rapid_requests'
  | 'unusual_behavior'
  | 'scam_address'
  | 'gateway_down'
  | 'high_risk_country'
  | 'multiple_failed_logins'
  | 'account_takeover_attempt'
  | 'unusual_device'
  | 'vpn_detected';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  userId?: string;
  ip?: string;
  metadata?: any;
  timestamp: string;
}

type AlertCallback = (alert: SecurityAlert) => void;

export const securityAlerts = new SecurityAlertService();
