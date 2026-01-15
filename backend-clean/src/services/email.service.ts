// ============================================================================
// RESEND EMAIL SERVICE
// All email notifications for the platform
// ============================================================================

import { Resend } from 'resend';
import { prisma } from '../lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  to: string;
  template: string;
  data: any;
}

/**
 * Send email using Resend
 */
export async function sendEmail({ to, template, data }: EmailData) {
  try {
    const emailContent = getEmailTemplate(template, data);

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Advancia <noreply@advancia.com>',
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // Log email
    await prisma.emailLog.create({
      data: {
        to,
        subject: emailContent.subject,
        template,
        resendId: result.data?.id,
        status: 'SENT',
      },
    });

    console.log(`[EMAIL] Sent ${template} to ${to}`);
    return result;
  } catch (error) {
    console.error('[EMAIL] Send error:', error);
    
    // Log failed email
    await prisma.emailLog.create({
      data: {
        to,
        subject: `Failed: ${template}`,
        template,
        status: 'FAILED',
      },
    });
    
    throw error;
  }
}

/**
 * Get email template
 */
function getEmailTemplate(template: string, data: any) {
  const templates: Record<string, (data: any) => { subject: string; html: string }> = {
    'registration-pending': (d) => ({
      subject: 'Registration Received - Pending Admin Approval',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Registration Received!</h1>
            </div>
            <div class="content">
              <p>Hi ${d.firstName},</p>
              
              <p>Thank you for registering with Advancia Pay Ledger!</p>
              
              <div class="status-box">
                <strong>⏳ Status: Pending Admin Approval</strong>
                <p style="margin: 10px 0 0 0;">Your account is currently under review by our admin team.</p>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your registration</li>
                <li>You'll receive an approval email within 24-48 hours</li>
                <li>If we don't approve within 24 hours, your account will be automatically approved</li>
                <li>Once approved, you can login and access all features</li>
              </ul>
              
              <p><strong>Your Registration Details:</strong></p>
              <ul>
                <li>Email: ${d.email}</li>
                <li>Registered: ${new Date().toLocaleString()}</li>
              </ul>
              
              <p>Please check your spam folder for future emails from us.</p>
              
              <p>Questions? Reply to this email or contact support@advancia.com</p>
              
              <p>Best regards,<br>The Advancia Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Advancia Pay Ledger. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }),

    'account-approved': (d) => ({
      subject: '🎉 Your Account Has Been Approved!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Advancia!</h1>
            </div>
            <div class="content">
              <p>Hi ${d.firstName},</p>
              
              <div class="success-box">
                <strong>✅ Great news! Your account has been approved!</strong>
                <p style="margin: 10px 0 0 0;">You can now login and start using Advancia Pay Ledger.</p>
              </div>
              
              <p>Your account includes:</p>
              
              <div class="feature">
                <strong>💳 Digital Wallet</strong>
                <p>Multi-blockchain support: Ethereum, Polygon, BSC, Arbitrum, Optimism, Stellar</p>
              </div>
              
              <div class="feature">
                <strong>💳 Virtual Payment Card</strong>
                <p>Instant virtual card for online payments</p>
              </div>
              
              <div class="feature">
                <strong>🏥 Medical Services</strong>
                <p>Book medical beds and appointments with crypto payments</p>
              </div>
              
              <div class="feature">
                <strong>🔒 Secure Transactions</strong>
                <p>Bank-grade security for all your transactions</p>
              </div>
              
              <p style="text-align: center;">
                <a href="${d.loginUrl}" class="btn">Login to Your Account</a>
              </p>
              
              <p><strong>Getting Started:</strong></p>
              <ol>
                <li>Login with your email and password</li>
                <li>Complete your profile</li>
                <li>Set up your wallet</li>
                <li>Start making payments!</li>
              </ol>
              
              <p>Need help? Our support team is here 24/7: support@advancia.com</p>
              
              <p>Welcome aboard!</p>
              <p>The Advancia Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Advancia Pay Ledger. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }),

    'account-rejected': (d) => ({
      subject: 'Registration Update',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .warning-box { background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Update</h1>
            </div>
            <div class="content">
              <p>Hi ${d.firstName},</p>
              
              <p>Thank you for your interest in Advancia Pay Ledger.</p>
              
              <div class="warning-box">
                <strong>Registration Status</strong>
                <p style="margin: 10px 0 0 0;">Unfortunately, we are unable to approve your registration at this time.</p>
              </div>
              
              <p><strong>Reason:</strong></p>
              <p>${d.reason}</p>
              
              <p>If you believe this is an error or would like to discuss this further, please contact our support team at support@advancia.com</p>
              
              <p>Best regards,<br>The Advancia Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Advancia Pay Ledger. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }),

    'admin-new-registration': (d) => ({
      subject: `New User Registration: ${d.userName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #333; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .btn { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 New User Registration</h2>
            </div>
            <div class="content">
              <p>Hi ${d.adminName},</p>
              
              <p>A new user has registered and is awaiting approval:</p>
              
              <div class="info">
                <strong>User Details:</strong><br>
                Name: ${d.userName}<br>
                Email: ${d.userEmail}<br>
                Role: ${d.userRole}<br>
                Registered: ${new Date(d.registeredAt).toLocaleString()}
              </div>
              
              <p><strong>Action Required:</strong></p>
              <p>Please review this registration and approve or reject within 24 hours. If no action is taken, the account will be automatically approved.</p>
              
              <p style="text-align: center;">
                <a href="${d.approvalUrl}" class="btn">Review Registration</a>
              </p>
              
              <p>Advancia Admin System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }),
  };

  const templateFn = templates[template];
  if (!templateFn) {
    throw new Error(`Email template '${template}' not found`);
  }

  return templateFn(data);
}
