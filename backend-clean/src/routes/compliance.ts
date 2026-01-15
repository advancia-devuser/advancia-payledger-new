import { Router, Request, Response } from 'express';
import { compliance } from '../services/compliance';
import { authenticate } from '../middleware/auth';
import { validate } from '../utils/validation';
import { z } from 'zod';

const router = Router();

// KYC verification schema
const kycVerificationSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  dateOfBirth: z.string().optional(),
  country: z.string().length(2, 'Country code must be 2 characters').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  documentType: z.enum(['passport', 'drivers_license', 'national_id']).optional(),
  documentNumber: z.string().optional(),
  sourceOfFunds: z.string().optional(),
  expectedVolume: z.number().optional(),
});

// Card compliance schema
const cardComplianceSchema = z.object({
  bin: z.string().min(6, 'BIN must be at least 6 digits'),
  cardholderName: z.string().min(2, 'Cardholder name required'),
  cardType: z.enum(['debit', 'credit', 'prepaid', 'virtual']),
  country: z.string().length(2).optional(),
  limits: z.object({
    daily: z.number().optional(),
    monthly: z.number().optional(),
  }).optional(),
});

// Perform KYC check
router.post('/kyc/verify', authenticate, validate(kycVerificationSchema), async (req: Request, res: Response) => {
  try {
    const result = await compliance.performKYCCheck(req.body);

    res.json({
      success: result.status === 'approved',
      status: result.status,
      checks: result.checks,
      issues: result.issues,
      riskLevel: result.riskLevel,
      message: result.status === 'approved' 
        ? 'KYC verification passed' 
        : result.status === 'pending'
        ? 'Additional verification required'
        : 'KYC verification failed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'KYC verification failed',
    });
  }
});

// Check card compliance for bank acceptance
router.post('/card/verify', authenticate, validate(cardComplianceSchema), async (req: Request, res: Response) => {
  try {
    const result = await compliance.checkCardCompliance(req.body);

    res.json({
      success: result.approved,
      approved: result.approved,
      bankAcceptance: result.bankAcceptance,
      checks: result.checks,
      issues: result.issues,
      message: result.approved 
        ? 'Card compliant and accepted by banks' 
        : 'Card compliance issues detected',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Card compliance check failed',
    });
  }
});

// Check PCI-DSS compliance
router.get('/pci-dss/status', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await compliance.checkPCICompliance({
      encryptionEnabled: true,
      secureStorage: true,
      accessControlEnabled: true,
      auditLoggingEnabled: true,
      networkSecurityEnabled: true,
    });

    res.json({
      success: result.passed,
      compliant: result.passed,
      details: result.details,
      standard: 'PCI-DSS',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'PCI-DSS compliance check failed',
    });
  }
});

// Check GDPR compliance
router.get('/gdpr/status', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await compliance.checkGDPRCompliance({
      consentObtained: true,
      privacyPolicyAccepted: true,
      dataRetentionPolicyDefined: true,
      deletionMechanismAvailable: true,
      dataExportAvailable: true,
    });

    res.json({
      success: result.passed,
      compliant: result.passed,
      details: result.details,
      standard: 'GDPR',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'GDPR compliance check failed',
    });
  }
});

// Get compliance summary
router.get('/summary', authenticate, async (req: Request, res: Response) => {
  try {
    // Get all compliance statuses
    const pciStatus = await compliance.checkPCICompliance({
      encryptionEnabled: true,
      secureStorage: true,
      accessControlEnabled: true,
      auditLoggingEnabled: true,
      networkSecurityEnabled: true,
    });

    const gdprStatus = await compliance.checkGDPRCompliance({
      consentObtained: true,
      privacyPolicyAccepted: true,
      dataRetentionPolicyDefined: true,
      deletionMechanismAvailable: true,
      dataExportAvailable: true,
    });

    const allCompliant = pciStatus.passed && gdprStatus.passed;

    res.json({
      success: true,
      compliant: allCompliant,
      standards: {
        'PCI-DSS': {
          compliant: pciStatus.passed,
          details: pciStatus.details,
        },
        'GDPR': {
          compliant: gdprStatus.passed,
          details: gdprStatus.details,
        },
      },
      bankAcceptance: allCompliant ? 'approved' : 'review_required',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get compliance summary',
    });
  }
});

export default router;
