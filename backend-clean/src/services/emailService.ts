import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Support multiple email providers
    const provider = process.env.EMAIL_PROVIDER || "smtp";

    if (provider === "resend") {
      // Resend SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      });
    } else if (provider === "postmark") {
      // Postmark SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: "smtp.postmarkapp.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.POSTMARK_SERVER_TOKEN,
          pass: process.env.POSTMARK_SERVER_TOKEN,
        },
      });
    } else if (provider === "zoho") {
      // Zoho SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.ZOHO_EMAIL_USER,
          pass: process.env.ZOHO_EMAIL_PASSWORD,
        },
      });
    } else {
      // Generic SMTP configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const from = process.env.EMAIL_FROM || "noreply@advanciapayledger.com";

      await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      });

      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string, verificationToken?: string): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const verificationLink = verificationToken 
      ? `${frontendUrl}/auth/verify-email?token=${verificationToken}`
      : null;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .info-box { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Advancia Pay! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with Advancia Pay Ledger! We're excited to have you join our platform.</p>
            
            ${verificationLink ? `
            <div class="info-box">
              <strong>📧 Verify Your Email</strong>
              <p style="margin: 10px 0 0 0;">Please verify your email address by clicking the button below:</p>
            </div>
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            <p style="font-size: 12px; color: #666;">Or copy and paste this link: ${verificationLink}</p>
            ` : ''}
            
            <div class="warning-box">
              <strong>⏳ Account Pending Approval</strong>
              <p style="margin: 10px 0 0 0;">Your account is currently under review by our admin team.</p>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your account within 24-48 hours</li>
              <li>You'll receive an email once your account is approved</li>
              <li>If no action is taken within 24 hours, your account will be automatically approved</li>
              <li>After approval, you can access all features including payments, wallets, and medical services</li>
            </ul>
            
            <p><strong>What you'll get access to:</strong></p>
            <ul>
              <li>💳 Multi-blockchain wallet (Ethereum, Polygon, BSC, Arbitrum, Optimism, Stellar)</li>
              <li>💳 Virtual payment cards for online purchases</li>
              <li>🏥 Medical facility bookings and appointments</li>
              <li>💰 Secure crypto and fiat transactions</li>
              <li>🔒 Bank-grade security and encryption</li>
            </ul>
            
            <p>While you wait, feel free to explore our FAQ and documentation.</p>
            <div style="text-align: center;">
              <a href="${frontendUrl}/faq" class="button" style="background: #6b7280;">View FAQ</a>
            </div>
            
            <p>If you have any questions, contact us at <a href="mailto:${process.env.EMAIL_SUPPORT || 'support@advanciapayledger.com'}">${process.env.EMAIL_SUPPORT || 'support@advanciapayledger.com'}</a></p>
            
            <p>Welcome aboard!</p>
            <p><strong>The Advancia Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay Ledger. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: "Welcome to Advancia Pay - Verify Your Email",
      html,
    });
  }

  async sendApprovalEmail(
    email: string,
    name: string,
    approved: boolean
  ): Promise<boolean> {
    const html = approved
      ? `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Approved! ✅</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Great news! Your Advancia Pay account has been approved and is now fully active.</p>
            <p><strong>You can now:</strong></p>
            <ul>
              <li>Make payments with Stripe or 235+ cryptocurrencies</li>
              <li>Book Med Bed sessions</li>
              <li>Access your dashboard and all features</li>
              <li>Manage your account settings</li>
            </ul>
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/login" class="button">Login to Dashboard</a>
            <p>Welcome aboard! 🚀</p>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
      : `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Application Update</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for your interest in Advancia Pay. Unfortunately, we are unable to approve your account at this time.</p>
            <p>If you believe this is an error or would like more information, please contact our support team at <a href="mailto:${process.env.EMAIL_SUPPORT || 'support@advanciapayledger.com'}">${process.env.EMAIL_SUPPORT || 'support@advanciapayledger.com'}</a></p>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: approved
        ? "Your Advancia Pay Account is Approved!"
        : "Advancia Pay Account Application Update",
      html,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #7c3aed; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request 🔐</h1>
          </div>
          <div class="content">
            <p>You requested a password reset for your Advancia Pay account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #7c3aed;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link expires in 1 hour</li>
                <li>If you didn't request this, ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: "Reset Your Advancia Pay Password",
      html,
    });
  }

  async sendMedBedBookingConfirmation(
    email: string,
    name: string,
    bookingDetails: {
      chamberName: string;
      sessionDate: string;
      duration: number;
      cost: number;
    }
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e5e7eb; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .button { display: inline-block; padding: 12px 30px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Med Bed Booking Confirmed! ✨</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your Med Bed session has been successfully booked!</p>
            <div class="booking-details">
              <h3 style="margin-top: 0;">Booking Details</h3>
              <div class="detail-row">
                <span><strong>Chamber:</strong></span>
                <span>${bookingDetails.chamberName}</span>
              </div>
              <div class="detail-row">
                <span><strong>Date:</strong></span>
                <span>${new Date(
                  bookingDetails.sessionDate
                ).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span><strong>Duration:</strong></span>
                <span>${bookingDetails.duration} minutes</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span><strong>Total Cost:</strong></span>
                <span style="color: #8b5cf6; font-weight: bold;">$${bookingDetails.cost.toFixed(
                  2
                )}</span>
              </div>
            </div>
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>Arrive 10 minutes before your session</li>
              <li>Bring a valid ID</li>
              <li>Wear comfortable clothing</li>
              <li>AI-powered health monitoring throughout</li>
            </ul>
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/medbeds/my-bookings" class="button">View My Bookings</a>
            <p>Questions? Contact us at <a href="mailto:${process.env.EMAIL_SUPPORT || 'support@advanciapayledger.com'}">${process.env.EMAIL_SUPPORT || 'support@advanciapayledger.com'}</a></p>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: "Med Bed Booking Confirmation - Advancia Pay",
      html,
    });
  }

  async sendPaymentConfirmation(
    email: string,
    paymentDetails: {
      amount: number;
      currency: string;
      method: string;
      transactionId: string;
    }
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e5e7eb; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Successful! ✅</h1>
          </div>
          <div class="content">
            <p>Your payment has been processed successfully.</p>
            <div class="payment-details">
              <h3 style="margin-top: 0;">Payment Details</h3>
              <div class="detail-row">
                <span><strong>Amount:</strong></span>
                <span>${
                  paymentDetails.amount
                } ${paymentDetails.currency.toUpperCase()}</span>
              </div>
              <div class="detail-row">
                <span><strong>Method:</strong></span>
                <span>${paymentDetails.method}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span><strong>Transaction ID:</strong></span>
                <span style="font-family: monospace; font-size: 12px;">${
                  paymentDetails.transactionId
                }</span>
              </div>
            </div>
            <p>Thank you for using Advancia Pay!</p>
          </div>
          <div class="footer">
            <p>© 2026 Advancia Pay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: "Payment Confirmation - Advancia Pay",
      html,
    });
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}

export const emailService = new EmailService();
export default emailService;
