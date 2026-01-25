// Agent Rejection Middleware
// Implements: "Reject any connections with eliminated agents - permanent access denial"
// Reference Number: 123456789-HELOC-CREATOR

import { Request, Response, NextFunction } from 'express';
import CreatorAgentRejectionService from '../services/CreatorAgentRejectionService';

// List of eliminated agents to permanently reject
const ELIMINATED_AGENTS = [
  'fraud_detection',
  'blockchain_service', 
  'real_time_monitoring',
  'robot_design_service',
  'wake_time_programming',
  'rockefeller_legacy_engine',
  'rich_stay_rich_over_death',
  'advanced_reality_service',
  'reality_trap_service',
  'truth_reality_service',
  'expression_service',
  'asset_implementation_service',
  'asset_integration_service',
  'missing_piece_service',
  'human_loop_service',
  'user_adaptation_service',
  'cleanup_reconfig_service',
  'blockchain_listener',
  'crypto_safety_service',
  'currency_service',
  'currency_conversion_service',
  'payment_monitoring_service',
  'advanced_payment_processing_service',
  'stripe_service',
  'alchemy_pay_service',
  'now_payments_service',
  'admin_analytics_service',
  'security_alerts_service',
  'admin_notification_service',
  'email_service',
  'socket_service',
  'compliance_service',
  'auto_approval_service',
  'instant_approval_service',
  'external_transfer_approval_service',
  'whole_life_insurance_service',
  'rockefeller_insurance_service',
  'rockefeller_home_protection_service',
  'rockefeller_premium_service',
  'rockefeller_flexible_payment_service',
  'self_sufficiency_service',
  'earth_training_service',
  'onboarding_beginner_challenges',
  'ledger_balance_service',
  'transaction_router_service',
  'cancel_money_service',
  'wallet_service',
  'address_generation_service',
  'text_orchestrator',
  'cascade_text_agent',
  'rockefeller_text_assistant',
  'internal_text_advisor',
  'policy_text_analyst',
  'trust_text_manager',
  'cron_service',
  'balance_service',
  'helo_c_service'
];

// Blocked routes for eliminated agents
const BLOCKED_ROUTES = [
  '/api/fraud-detection',
  '/api/blockchain',
  '/api/monitoring',
  '/api/robot-design',
  '/api/wake-time-programming',
  '/api/rockefeller-legacy',
  '/api/rich-stay-rich',
  '/api/advanced-reality',
  '/api/reality-trap',
  '/api/truth-reality',
  '/api/expression',
  '/api/asset-implementation',
  '/api/asset-integration',
  '/api/missing-piece',
  '/api/adaptive',
  '/api/cleanup-reconfig',
  '/api/crypto/multi-crypto',
  '/api/currency/exchange',
  '/api/payments/advanced',
  '/api/crypto',
  '/api/stripe',
  '/api/admin-funds',
  '/api/kpi',
  '/api/notifications',
  '/api/email',
  '/api/compliance',
  '/api/auth/auto-approval',
  '/api/auth/instant-approval',
  '/api/external-transfer',
  '/api/whole-life-insurance',
  '/api/rockefeller-insurance',
  '/api/rockefeller-text-home-protection',
  '/api/rockefeller-internal',
  '/api/rockefeller-flexible-payment',
  '/api/self-sufficiency',
  '/api/earth-training',
  '/api/onboarding',
  '/api/transactions',
  '/api/cancel-money',
  '/api/wallet',
  '/api/blockchain/contracts',
  '/api/text',
  '/api/rockefeller-family-protection',
  '/api/rockefeller-text-home-protection',
  '/api/rockefeller-internal',
  '/api/balance'
];

export const rejectEliminatedAgents = (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestPath = req.path;
    const userAgent = req.headers['user-agent'] || '';
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Check if request path is blocked
    const isBlockedRoute = BLOCKED_ROUTES.some(route => 
      requestPath.startsWith(route) || requestPath.includes(route.replace('/api/', ''))
    );

    // Check if user agent indicates eliminated agent
    const isEliminatedAgent = ELIMINATED_AGENTS.some(agent => 
      userAgent.toLowerCase().includes(agent.replace('_', '-')) ||
      userAgent.toLowerCase().includes(agent.replace('_', ' ')) ||
      requestPath.includes(agent.replace('_', '-'))
    );

    if (isBlockedRoute || isEliminatedAgent) {
      // Block the connection permanently
      const blockedAgent = ELIMINATED_AGENTS.find(agent => 
        userAgent.toLowerCase().includes(agent.replace('_', '-')) ||
        userAgent.toLowerCase().includes(agent.replace('_', ' '))
      ) || 'unknown';

      // Log the rejection attempt
      CreatorAgentRejectionService.blockConnection(blockedAgent, {
        type: 'HTTP',
        sourceIP: clientIP,
        userAgent: userAgent,
        requestPath: requestPath
      });

      // Return permanent denial response
      return res.status(403).json({
        success: false,
        error: 'AGENT_PERMANENTLY_REJECTED',
        message: 'This agent has been eliminated by Creator directive',
        reason: 'Unnecessary complexity elimination',
        accessLevel: 'PERMANENTLY_DENIED',
        creatorAuthority: 'CREATOR_DIRECTIVE_123456789',
        timestamp: new Date(),
        blockedAgent: blockedAgent,
        philosophy: 'As Creator, I choose what I need - eliminating unnecessary complexity'
      });
    }

    // Check for specific agent service requests
    const serviceName = req.headers['x-service-name'] as string;
    if (serviceName && ELIMINATED_AGENTS.includes(serviceName.toLowerCase().replace(' ', '_'))) {
      CreatorAgentRejectionService.blockConnection(serviceName, {
        type: 'SERVICE',
        sourceIP: clientIP,
        userAgent: userAgent,
        requestPath: requestPath
      });

      return res.status(403).json({
        success: false,
        error: 'SERVICE_PERMANENTLY_REJECTED',
        message: `Service ${serviceName} has been eliminated by Creator directive`,
        reason: 'Service consolidation and elimination',
        accessLevel: 'PERMANENTLY_DENIED',
        creatorAuthority: 'CREATOR_DIRECTIVE_123456789',
        timestamp: new Date()
      });
    }

    // Allow request to proceed
    next();

  } catch (error) {
    console.error('Error in agent rejection middleware:', error);
    // Fail secure - block if there's an error
    return res.status(403).json({
      success: false,
      error: 'REJECTION_SYSTEM_ERROR',
      message: 'Agent rejection system error - access denied',
      timestamp: new Date()
    });
  }
};

// WebSocket rejection middleware
export const rejectEliminatedAgentConnections = (socket: any, next: Function) => {
  try {
    const userAgent = socket.handshake.headers['user-agent'] || '';
    const clientIP = socket.handshake.address || 'unknown';

    // Check if connection is from eliminated agent
    const isEliminatedAgent = ELIMINATED_AGENTS.some(agent => 
      userAgent.toLowerCase().includes(agent.replace('_', '-')) ||
      userAgent.toLowerCase().includes(agent.replace('_', ' '))
    );

    if (isEliminatedAgent) {
      const blockedAgent = ELIMINATED_AGENTS.find(agent => 
        userAgent.toLowerCase().includes(agent.replace('_', '-')) ||
        userAgent.toLowerCase().includes(agent.replace('_', ' '))
      ) || 'unknown';

      CreatorAgentRejectionService.blockConnection(blockedAgent, {
        type: 'WEBSOCKET',
        sourceIP: clientIP,
        userAgent: userAgent,
        requestPath: socket.handshake.url || '/socket.io'
      });

      return next(new Error('Agent permanently rejected by Creator directive'));
    }

    next();

  } catch (error) {
    console.error('Error in WebSocket agent rejection:', error);
    return next(new Error('WebSocket rejection system error'));
  }
};

// Database access rejection middleware
export const rejectEliminatedAgentDatabaseAccess = (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceName = req.headers['x-service-name'] as string;
    const querySource = req.headers['x-query-source'] as string;

    // Check if database access is from eliminated agent
    if (serviceName && ELIMINATED_AGENTS.includes(serviceName.toLowerCase().replace(' ', '_'))) {
      return res.status(403).json({
        success: false,
        error: 'DATABASE_ACCESS_PERMANENTLY_REJECTED',
        message: `Database access for ${serviceName} has been permanently denied`,
        reason: 'Agent eliminated - database access revoked',
        creatorAuthority: 'CREATOR_DIRECTIVE_123456789',
        timestamp: new Date()
      });
    }

    if (querySource && ELIMINATED_AGENTS.includes(querySource.toLowerCase().replace(' ', '_'))) {
      return res.status(403).json({
        success: false,
        error: 'DATABASE_QUERY_PERMANENTLY_REJECTED',
        message: `Database query from ${querySource} has been permanently denied`,
        reason: 'Query source eliminated - access revoked',
        creatorAuthority: 'CREATOR_DIRECTIVE_123456789',
        timestamp: new Date()
      });
    }

    next();

  } catch (error) {
    console.error('Error in database access rejection:', error);
    return res.status(403).json({
      success: false,
      error: 'DATABASE_REJECTION_SYSTEM_ERROR',
      message: 'Database rejection system error - access denied',
      timestamp: new Date()
    });
  }
};

export default {
  rejectEliminatedAgents,
  rejectEliminatedAgentConnections,
  rejectEliminatedAgentDatabaseAccess
};
