// ============================================================================
// MAINTENANCE MODE
// Admin can toggle maintenance mode from dashboard
// Shows nice message to users when platform is down for updates
// ============================================================================

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Check if maintenance mode is enabled
 * GET /api/system/maintenance
 */
router.get('/maintenance', async (req, res) => {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'MAINTENANCE_MODE' },
    });

    const isEnabled = config?.value === 'true';

    res.json({
      enabled: isEnabled,
      message: isEnabled ? (await getMaintenanceMessage()) : null,
    });
  } catch (error) {
    res.json({
      enabled: false,
      message: null,
    });
  }
});

/**
 * Toggle maintenance mode (Admin only)
 * POST /api/system/maintenance/toggle
 */
router.post('/maintenance/toggle', authenticate, requireAdmin, async (req, res) => {
  try {
    const { enabled, message } = req.body;

    // Update or create maintenance mode config
    await prisma.systemConfig.upsert({
      where: { key: 'MAINTENANCE_MODE' },
      update: {
        value: enabled ? 'true' : 'false',
        updatedBy: req.user!.id,
      },
      create: {
        key: 'MAINTENANCE_MODE',
        value: enabled ? 'true' : 'false',
        description: 'Platform maintenance mode',
        updatedBy: req.user!.id,
      },
    });

    // Update maintenance message if provided
    if (message) {
      await prisma.systemConfig.upsert({
        where: { key: 'MAINTENANCE_MESSAGE' },
        update: {
          value: message,
          updatedBy: req.user!.id,
        },
        create: {
          key: 'MAINTENANCE_MESSAGE',
          value: message,
          description: 'Maintenance mode message',
          updatedBy: req.user!.id,
        },
      });
    }

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId: req.user!.id,
        adminEmail: req.user!.email,
        action: 'SYSTEM_CONFIG',
        details: {
          action: enabled ? 'enable_maintenance' : 'disable_maintenance',
          message,
        },
        ipAddress: req.ip,
      },
    });

    res.json({
      success: true,
      enabled,
      message: enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
    });
  } catch (error: any) {
    console.error('Toggle maintenance error:', error);
    res.status(500).json({
      error: 'Failed to toggle maintenance mode',
    });
  }
});

/**
 * Get maintenance message
 */
async function getMaintenanceMessage(): Promise<string> {
  const config = await prisma.systemConfig.findUnique({
    where: { key: 'MAINTENANCE_MESSAGE' },
  });

  return config?.value || 'We\'re currently performing scheduled maintenance. We\'ll be back shortly!';
}

export default router;
