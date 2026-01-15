import cron from "node-cron";
import prisma from "../lib/prisma";
import { emailService } from "./emailService";

/**
 * Auto-Approval Service
 * Automatically approves users who have been pending for more than 24 hours
 */
class AutoApprovalService {
  private cronJob: cron.ScheduledTask | null = null;

  /**
   * Start the auto-approval cron job
   * Runs every hour to check for users pending approval for 24+ hours
   */
  start() {
    // Run every hour at minute 0
    this.cronJob = cron.schedule("0 * * * *", async () => {
      await this.processAutoApprovals();
    });

    console.log("[AUTO-APPROVAL] Service started - runs every hour");
  }

  /**
   * Stop the auto-approval cron job
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log("[AUTO-APPROVAL] Service stopped");
    }
  }

  /**
   * Process auto-approvals for users pending for 24+ hours
   */
  async processAutoApprovals() {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find users pending approval for more than 24 hours
      const pendingUsers = await prisma.user.findMany({
        where: {
          status: "PENDING_APPROVAL",
          registeredAt: {
            lte: twentyFourHoursAgo,
          },
        },
      });

      if (pendingUsers.length === 0) {
        console.log("[AUTO-APPROVAL] No users to auto-approve");
        return;
      }

      console.log(
        `[AUTO-APPROVAL] Processing ${pendingUsers.length} users for auto-approval`
      );

      for (const user of pendingUsers) {
        try {
          // Update user status to ACTIVE
          await prisma.user.update({
            where: { id: user.id },
            data: {
              status: "ACTIVE",
              autoApproved: true,
              approvedAt: new Date(),
              approvedBy: "system-auto-approval",
            },
          });

          // Send approval email
          try {
            await emailService.sendApprovalEmail(
              user.email,
              user.firstName,
              true
            );
            console.log(
              `[AUTO-APPROVAL] Approval email sent to ${user.email}`
            );
          } catch (emailError) {
            console.error(
              `[AUTO-APPROVAL] Failed to send approval email to ${user.email}:`,
              emailError
            );
          }

          console.log(
            `[AUTO-APPROVAL] User ${user.email} auto-approved successfully`
          );
        } catch (error) {
          console.error(
            `[AUTO-APPROVAL] Failed to auto-approve user ${user.email}:`,
            error
          );
        }
      }

      console.log(
        `[AUTO-APPROVAL] Completed processing ${pendingUsers.length} users`
      );
    } catch (error) {
      console.error("[AUTO-APPROVAL] Error in processAutoApprovals:", error);
    }
  }

  /**
   * Manually trigger auto-approval process (for testing)
   */
  async triggerManual() {
    console.log("[AUTO-APPROVAL] Manual trigger initiated");
    await this.processAutoApprovals();
  }
}

export const autoApprovalService = new AutoApprovalService();
export default autoApprovalService;
