import prisma from "../lib/prisma";
import { emailService } from "./emailService";

/**
 * Admin Notification Service
 * Sends notifications to admins about important events
 */
class AdminNotificationService {
  /**
   * Notify admins about new user registration
   */
  async notifyNewRegistration(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error(
          `[ADMIN-NOTIFY] User not found for notification: ${userId}`
        );
        return;
      }

      // Get all admin users
      const admins = await prisma.user.findMany({
        where: {
          role: {
            in: ["ADMIN", "SUPER_ADMIN"],
          },
          status: "ACTIVE",
        },
      });

      if (admins.length === 0) {
        console.log("[ADMIN-NOTIFY] No active admins found to notify");
        return;
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const approvalUrl = `${frontendUrl}/admin/users/${user.id}`;

      // Send notification to each admin
      for (const admin of admins) {
        try {
          await this.sendAdminEmail(admin.email, {
            adminName: admin.firstName,
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email,
            userRole: user.role,
            registeredAt: user.registeredAt.toISOString(),
            approvalUrl,
          });

          console.log(
            `[ADMIN-NOTIFY] Notification sent to admin ${admin.email}`
          );
        } catch (emailError) {
          console.error(
            `[ADMIN-NOTIFY] Failed to send notification to ${admin.email}:`,
            emailError
          );
        }
      }

      // Log admin action
      await prisma.adminAction.create({
        data: {
          adminId: "system",
          adminEmail: "system@advancia.com",
          action: "APPROVE_USER",
          targetId: user.id,
          targetType: "user",
          details: {
            event: "new_registration_notification",
            userEmail: user.email,
            notifiedAdmins: admins.length,
          },
        },
      });

      console.log(
        `[ADMIN-NOTIFY] Notified ${admins.length} admins about new registration: ${user.email}`
      );
    } catch (error) {
      console.error("[ADMIN-NOTIFY] Error in notifyNewRegistration:", error);
    }
  }

  /**
   * Send admin notification email
   */
  private async sendAdminEmail(
    adminEmail: string,
    data: {
      adminName: string;
      userName: string;
      userEmail: string;
      userRole: string;
      registeredAt: string;
      approvalUrl: string;
    }
  ) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6; border-radius: 4px; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 New User Registration</h2>
          </div>
          <div class="content">
            <p>Hi ${data.adminName},</p>
            
            <p>A new user has registered and is awaiting approval:</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">User Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Name:</td>
                  <td style="padding: 8px 0;">${data.userName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;">${data.userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Role:</td>
                  <td style="padding: 8px 0;">${data.userRole}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Registered:</td>
                  <td style="padding: 8px 0;">${new Date(data.registeredAt).toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div class="warning">
              <strong>⏰ Action Required</strong>
              <p style="margin: 10px 0 0 0;">Please review this registration and approve or reject within 24 hours. If no action is taken, the account will be automatically approved.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.approvalUrl}" class="button">Review Registration</a>
            </div>
            
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              Or copy and paste this link: ${data.approvalUrl}
            </p>
            
            <p style="margin-top: 30px;">
              <strong>Advancia Admin System</strong>
            </p>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay Ledger. All rights reserved.</p>
            <p>This is an automated admin notification</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailService.sendEmail({
      to: adminEmail,
      subject: `New User Registration: ${data.userName}`,
      html,
    });
  }

  /**
   * Notify admins about pending approvals (daily digest)
   */
  async sendPendingApprovalDigest() {
    try {
      const pendingUsers = await prisma.user.findMany({
        where: {
          status: "PENDING_APPROVAL",
        },
        orderBy: {
          registeredAt: "desc",
        },
      });

      if (pendingUsers.length === 0) {
        console.log("[ADMIN-NOTIFY] No pending approvals for digest");
        return;
      }

      const admins = await prisma.user.findMany({
        where: {
          role: {
            in: ["ADMIN", "SUPER_ADMIN"],
          },
          status: "ACTIVE",
        },
      });

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

      for (const admin of admins) {
        try {
          await this.sendDigestEmail(admin.email, {
            adminName: admin.firstName,
            pendingCount: pendingUsers.length,
            users: pendingUsers.map((u) => ({
              name: `${u.firstName} ${u.lastName}`,
              email: u.email,
              registeredAt: u.registeredAt.toISOString(),
            })),
            dashboardUrl: `${frontendUrl}/admin/users?status=pending`,
          });

          console.log(`[ADMIN-NOTIFY] Digest sent to admin ${admin.email}`);
        } catch (emailError) {
          console.error(
            `[ADMIN-NOTIFY] Failed to send digest to ${admin.email}:`,
            emailError
          );
        }
      }

      console.log(
        `[ADMIN-NOTIFY] Sent pending approval digest to ${admins.length} admins`
      );
    } catch (error) {
      console.error("[ADMIN-NOTIFY] Error in sendPendingApprovalDigest:", error);
    }
  }

  /**
   * Send daily digest email
   */
  private async sendDigestEmail(
    adminEmail: string,
    data: {
      adminName: string;
      pendingCount: number;
      users: Array<{ name: string; email: string; registeredAt: string }>;
      dashboardUrl: string;
    }
  ) {
    const userRows = data.users
      .slice(0, 10)
      .map(
        (u) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 8px;">${u.name}</td>
        <td style="padding: 12px 8px;">${u.email}</td>
        <td style="padding: 12px 8px; font-size: 12px; color: #666;">${new Date(u.registeredAt).toLocaleDateString()}</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; }
          th { background: #f3f4f6; padding: 12px 8px; text-align: left; font-weight: 600; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📊 Pending Approvals Digest</h2>
          </div>
          <div class="content">
            <p>Hi ${data.adminName},</p>
            
            <p>You have <strong>${data.pendingCount} user(s)</strong> waiting for approval:</p>
            
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                ${userRows}
              </tbody>
            </table>
            
            ${data.pendingCount > 10 ? `<p style="text-align: center; color: #666; font-size: 14px;">And ${data.pendingCount - 10} more...</p>` : ""}
            
            <div style="text-align: center;">
              <a href="${data.dashboardUrl}" class="button">Review All Pending Users</a>
            </div>
            
            <p style="margin-top: 30px;">
              <strong>Advancia Admin System</strong>
            </p>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay Ledger. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailService.sendEmail({
      to: adminEmail,
      subject: `${data.pendingCount} User(s) Pending Approval`,
      html,
    });
  }
}

export const adminNotificationService = new AdminNotificationService();
export default adminNotificationService;
