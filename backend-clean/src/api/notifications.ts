import { Router, Request, Response } from 'express';

const router = Router();

// In-memory notification store (in production, use database)
interface Notification {
  id: string;
  type: 'card_order' | 'link_click' | 'onboarding';
  message: string;
  data: any;
  timestamp: string;
  read: boolean;
}

let notifications: Notification[] = [];

// Order card notification
router.post('/order-card', async (req: Request, res: Response) => {
  try {
    const { cardholderName, cardNumber, timestamp } = req.body;

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      type: 'card_order',
      message: `${cardholderName} requested a physical card (****${cardNumber})`,
      data: { cardholderName, cardNumber, timestamp },
      timestamp: new Date().toISOString(),
      read: false
    };

    notifications.unshift(notification);

    // In production, send real-time notification via WebSocket or push notification
    console.log('🔔 ADMIN NOTIFICATION:', notification.message);

    return res.json({
      success: true,
      message: 'Admin notified successfully',
      notificationId: notification.id
    });
  } catch (error) {
    console.error('Notification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send notification'
    });
  }
});

// Link click notification
router.post('/link-click', async (req: Request, res: Response) => {
  try {
    const { userId, userName, linkUrl, timestamp } = req.body;

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      type: 'link_click',
      message: `${userName || 'User'} clicked on link: ${linkUrl}`,
      data: { userId, userName, linkUrl, timestamp },
      timestamp: new Date().toISOString(),
      read: false
    };

    notifications.unshift(notification);

    console.log('🔔 ADMIN NOTIFICATION:', notification.message);

    return res.json({
      success: true,
      message: 'Link click tracked',
      notificationId: notification.id
    });
  } catch (error) {
    console.error('Link tracking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to track link click'
    });
  }
});

// Onboarding notification
router.post('/onboarding', async (req: Request, res: Response) => {
  try {
    const { userId, userName, step, timestamp } = req.body;

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      type: 'onboarding',
      message: `${userName || 'New user'} is proceeding with onboarding - Step: ${step}`,
      data: { userId, userName, step, timestamp },
      timestamp: new Date().toISOString(),
      read: false
    };

    notifications.unshift(notification);

    console.log('🔔 ADMIN NOTIFICATION:', notification.message);

    return res.json({
      success: true,
      message: 'Onboarding tracked',
      notificationId: notification.id
    });
  } catch (error) {
    console.error('Onboarding tracking error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to track onboarding'
    });
  }
});

// Get all notifications (admin only)
router.get('/admin/all', async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      count: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.patch('/admin/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notification.read = true;

    return res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
});

// Clear all notifications
router.delete('/admin/clear', async (req: Request, res: Response) => {
  try {
    notifications = [];
    return res.json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    console.error('Clear notifications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to clear notifications'
    });
  }
});

export default router;
