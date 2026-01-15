import cron from "node-cron";
import { autoApprovalService } from "./autoApproval.service";
import { adminNotificationService } from "./adminNotification.service";

/**
 * Cron Service
 * Manages all scheduled tasks for the application
 */
class CronService {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Initialize all cron jobs
   */
  start() {
    console.log("[CRON] Starting cron services...");

    // Auto-approval job - runs every hour
    this.startAutoApprovalJob();

    // Daily admin digest - runs at 9 AM every day
    this.startDailyDigestJob();

    console.log("[CRON] All cron services started successfully");
  }

  /**
   * Start auto-approval cron job
   * Runs every hour to check for users pending approval for 24+ hours
   */
  private startAutoApprovalJob() {
    const job = cron.schedule("0 * * * *", async () => {
      console.log("[CRON] Running auto-approval job...");
      try {
        await autoApprovalService.processAutoApprovals();
      } catch (error) {
        console.error("[CRON] Auto-approval job failed:", error);
      }
    });

    this.jobs.set("auto-approval", job);
    console.log("[CRON] Auto-approval job scheduled (runs every hour)");
  }

  /**
   * Start daily admin digest job
   * Runs at 9 AM every day to send pending approval digest
   */
  private startDailyDigestJob() {
    // Run at 9:00 AM every day
    const job = cron.schedule("0 9 * * *", async () => {
      console.log("[CRON] Running daily admin digest job...");
      try {
        await adminNotificationService.sendPendingApprovalDigest();
      } catch (error) {
        console.error("[CRON] Daily digest job failed:", error);
      }
    });

    this.jobs.set("daily-digest", job);
    console.log("[CRON] Daily digest job scheduled (runs at 9 AM daily)");
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    console.log("[CRON] Stopping all cron jobs...");
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`[CRON] Stopped job: ${name}`);
    });
    this.jobs.clear();
    console.log("[CRON] All cron jobs stopped");
  }

  /**
   * Get status of all jobs
   */
  getStatus() {
    const status: Record<string, boolean> = {};
    this.jobs.forEach((job, name) => {
      status[name] = true; // Running
    });
    return status;
  }

  /**
   * Manually trigger a specific job (for testing)
   */
  async triggerJob(jobName: string) {
    console.log(`[CRON] Manually triggering job: ${jobName}`);
    
    switch (jobName) {
      case "auto-approval":
        await autoApprovalService.processAutoApprovals();
        break;
      case "daily-digest":
        await adminNotificationService.sendPendingApprovalDigest();
        break;
      default:
        throw new Error(`Unknown job: ${jobName}`);
    }
    
    console.log(`[CRON] Job ${jobName} completed`);
  }
}

export const cronService = new CronService();
export default cronService;
