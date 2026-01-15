import express, { Request, Response } from "express";
import {
  emailService,
  sendEmail,
  EmailProvider,
  testEmailProviders,
  getEmailProviderStatus,
} from "../lib/emailService";

const router = express.Router();

/**
 * GET /api/email/status
 * Get email service provider status
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const status = getEmailProviderStatus();
    res.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Email status error:", error);
    res.status(500).json({ error: "Failed to get email status" });
  }
});

/**
 * POST /api/email/test
 * Test all configured email providers
 */
router.post("/test", async (req: Request, res: Response) => {
  try {
    const results = await testEmailProviders();
    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({ error: "Failed to test email providers" });
  }
});

/**
 * POST /api/email/send
 * Send email with optional provider preference
 */
router.post("/send", async (req: Request, res: Response) => {
  try {
    const { to, subject, html, text, from, provider, attachments } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        error: "Required fields: to, subject",
      });
    }

    if (!html && !text) {
      return res.status(400).json({
        error: "Either html or text content is required",
      });
    }

    const emailConfig = {
      from: from || process.env.EMAIL_FROM || "noreply@advanciapayledger.com",
      to,
      subject,
      html,
      text,
      attachments,
    };

    const preferredProvider = provider as EmailProvider;
    const result = await sendEmail(emailConfig, preferredProvider);

    res.json({
      success: result.success,
      messageId: result.messageId,
      provider: result.provider,
      error: result.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({
      error: "Failed to send email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/email/send-batch
 * Send batch emails (for newsletters, etc.)
 */
router.post("/send-batch", async (req: Request, res: Response) => {
  try {
    const {
      recipients,
      subject,
      html,
      text,
      from,
      provider,
      batchSize = 10, // Send in batches to avoid rate limits
      delay = 1000, // Delay between batches in ms
    } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        error: "Recipients array is required",
      });
    }

    if (!subject || (!html && !text)) {
      return res.status(400).json({
        error: "Subject and either html or text content are required",
      });
    }

    const results = [];
    const preferredProvider = provider as EmailProvider;

    // Process in batches
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);

      for (const recipient of batch) {
        try {
          const emailConfig = {
            from:
              from || process.env.EMAIL_FROM || "noreply@advanciapayledger.com",
            to: recipient,
            subject,
            html,
            text,
          };

          const result = await sendEmail(emailConfig, preferredProvider);
          results.push({
            recipient,
            success: result.success,
            messageId: result.messageId,
            provider: result.provider,
            error: result.error,
          });

          // Small delay between individual emails
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          results.push({
            recipient,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      // Delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      success: true,
      total: recipients.length,
      successful: successCount,
      failed: failureCount,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Batch email send error:", error);
    res.status(500).json({
      error: "Failed to send batch emails",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/email/template
 * Send email using predefined template
 */
router.post("/template", async (req: Request, res: Response) => {
  try {
    const { template, to, data = {}, from, provider } = req.body;

    if (!template || !to) {
      return res.status(400).json({
        error: "Template name and recipient are required",
      });
    }

    let emailContent: { subject: string; html: string; text?: string } | null =
      null;

    // Define email templates
    switch (template) {
      case "welcome":
        emailContent = {
          subject: "Welcome to Advancia Pay Ledger! 🎉",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #667eea;">Welcome to Advancia Pay Ledger! 🎉</h2>
              <p>Hi ${data.name || "there"},</p>
              <p>Welcome to the future of healthcare payments! Your account has been successfully created.</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>What's Next?</h3>
                <ul>
                  <li>✅ Verify your email address</li>
                  <li>🏥 Set up your healthcare facility profile</li>
                  <li>💳 Configure payment methods</li>
                  <li>🚀 Start accepting payments!</li>
                </ul>
              </div>
              <p>
                <a href="${process.env.FRONTEND_URL}/dashboard"
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Go to Dashboard
                </a>
              </p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                If you didn't create this account, please ignore this email.
              </p>
            </div>
          `,
          text: `Welcome to Advancia Pay Ledger! Hi ${
            data.name || "there"
          }, your account has been created. Visit ${
            process.env.FRONTEND_URL
          }/dashboard to get started.`,
        };
        break;

      case "payment-received":
        emailContent = {
          subject: "Payment Received - Advancia Pay Ledger",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #667eea;">Payment Received! 💰</h2>
              <p>Hi ${data.name || "there"},</p>
              <p>We've received your payment of <strong>${
                data.amount || "0.00"
              } ${data.currency || "USD"}</strong>.</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Payment Details</h3>
                <p><strong>Transaction ID:</strong> ${
                  data.transactionId || "N/A"
                }</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Method:</strong> ${data.method || "N/A"}</p>
                <p><strong>Status:</strong> <span style="color: #28a745;">Completed</span></p>
              </div>
              <p>
                <a href="${process.env.FRONTEND_URL}/transactions"
                   style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Transaction
                </a>
              </p>
            </div>
          `,
          text: `Payment received: ${data.amount || "0.00"} ${
            data.currency || "USD"
          }. Transaction ID: ${data.transactionId || "N/A"}`,
        };
        break;

      case "newsletter-subscription":
        emailContent = {
          subject: "Welcome to Advancia Pay Ledger Newsletter! 📧",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #667eea;">Newsletter Subscription Confirmed! 🎉</h2>
              <p>Hi there,</p>
              <p>You've successfully subscribed to the Advancia Pay Ledger newsletter!</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>What You'll Receive:</h3>
                <ul>
                  <li>🚀 Latest crypto payment features</li>
                  <li>💡 Industry insights and trends</li>
                  <li>🎯 Exclusive promotions and offers</li>
                  <li>🔒 Security tips and best practices</li>
                </ul>
              </div>
              <p>Stay tuned for exciting updates!</p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${to}">Unsubscribe</a>
              </p>
            </div>
          `,
          text: `Thanks for subscribing to the Advancia Pay Ledger newsletter! Unsubscribe: ${process.env.FRONTEND_URL}/unsubscribe?email=${to}`,
        };
        break;

      default:
        return res.status(400).json({
          error:
            "Unknown template. Available templates: welcome, payment-received, newsletter-subscription",
        });
    }

    if (!emailContent) {
      return res
        .status(500)
        .json({ error: "Failed to generate email content" });
    }

    const emailConfig = {
      from: from || process.env.EMAIL_FROM || "noreply@advanciapayledger.com",
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const preferredProvider = provider as EmailProvider;
    const result = await sendEmail(emailConfig, preferredProvider);

    res.json({
      success: result.success,
      messageId: result.messageId,
      provider: result.provider,
      template,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Template email error:", error);
    res.status(500).json({
      error: "Failed to send template email",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
