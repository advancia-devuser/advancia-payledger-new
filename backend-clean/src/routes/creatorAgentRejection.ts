// Creator Agent Rejection API Routes
// Implements: "Reject any connections with eliminated agents - permanent access denial"
// Reference Number: 123456789-HELOC-CREATOR

import { Router, Request, Response } from 'express';
import CreatorAgentRejectionService from '../services/CreatorAgentRejectionService';

const router = Router();

// START CREATOR AGENT REJECTION
router.post('/start', async (req: Request, res: Response) => {
  try {
    await CreatorAgentRejectionService.startCreatorAgentRejection();
    res.json({
      success: true,
      message: 'Creator Agent Rejection activated',
      philosophy: 'Reject any connections with eliminated agents - permanent access denial',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// STOP CREATOR AGENT REJECTION
router.post('/stop', async (req: Request, res: Response) => {
  try {
    await CreatorAgentRejectionService.stopCreatorAgentRejection();
    res.json({
      success: true,
      message: 'Creator Agent Rejection deactivated',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// GET REJECTED AGENTS
router.get('/rejected', async (req: Request, res: Response) => {
  try {
    const rejected = CreatorAgentRejectionService.getRejectedAgents();
    res.json({
      success: true,
      data: rejected,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// GET CONNECTION REJECTIONS
router.get('/rejections', async (req: Request, res: Response) => {
  try {
    const rejections = CreatorAgentRejectionService.getConnectionRejections();
    res.json({
      success: true,
      data: rejections,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// GET FIREWALL STATUS
router.get('/firewall', async (req: Request, res: Response) => {
  try {
    const firewalls = CreatorAgentRejectionService.getRejectionFirewalls();
    res.json({
      success: true,
      data: firewalls,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// GET ACCESS DENIALS
router.get('/denials', async (req: Request, res: Response) => {
  try {
    const denials = CreatorAgentRejectionService.getAgentAccessDenials();
    res.json({
      success: true,
      data: denials,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// GET REJECTION REPORT
router.get('/report', async (req: Request, res: Response) => {
  try {
    const report = await CreatorAgentRejectionService.generateRejectionReport();
    res.json({
      success: true,
      data: report,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// CHECK IF AGENT IS REJECTED
router.get('/check/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const isRejected = CreatorAgentRejectionService.isAgentRejected(agentId);
    const details = CreatorAgentRejectionService.getRejectionDetails(agentId);
    
    res.json({
      success: true,
      data: {
        agentId,
        isRejected,
        details,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// BLOCK CONNECTION MANUALLY
router.post('/block', async (req: Request, res: Response) => {
  try {
    const { agentId, connectionDetails } = req.body;
    CreatorAgentRejectionService.blockConnection(agentId, connectionDetails);
    
    res.json({
      success: true,
      message: `Connection blocked for agent: ${agentId}`,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// UPDATE FIREWALL RULES
router.post('/firewall/update', async (req: Request, res: Response) => {
  try {
    const { firewallId, newRules } = req.body;
    res.json({
      success: true,
      message: `Firewall rules updated: ${firewallId}`,
      rules: newRules,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

// ESCALATE REJECTION
router.post('/escalate', async (req: Request, res: Response) => {
  try {
    const { agentId, escalationReason } = req.body;
    res.json({
      success: true,
      message: `Rejection escalated for agent: ${agentId}`,
      reason: escalationReason,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date()
    });
  }
});

export default router;
