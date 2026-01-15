// Email templates for Advancia Pay Ledger

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface TemplateData {
  [key: string]: any;
}

// Base template wrapper
const baseTemplate = (content: string, title?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || "Advancia Pay Ledger"}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
        }
        .highlight {
            color: #667eea;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Advancia Pay Ledger</div>
    </div>

    ${content}

    <div class="footer">
        <p>&copy; 2026 Advancia Pay Ledger. All rights reserved.</p>
        <p>This email was sent to {{email}}. <a href="{{frontendUrl}}/unsubscribe?email={{email}}">Unsubscribe</a></p>
    </div>
</body>
</html>
`;

// Template generators
export class EmailTemplates {
  private static replaceVariables = (
    template: string,
    data: TemplateData
  ): string => {
    let result = template;
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, data[key] || "");
    });
    return result;
  };

  static welcome(data: TemplateData): EmailTemplate {
    const content = `
        <div class="content">
            <h2>Welcome to Advancia Pay Ledger! 🎉</h2>
            <p>Hi {{name}},</p>
            <p>Welcome to the future of healthcare payments! Your account has been successfully created.</p>

            <h3>What's Next?</h3>
            <ul>
                <li>✅ Verify your email address</li>
                <li>🏥 Set up your healthcare facility profile</li>
                <li>💳 Configure payment methods</li>
                <li>🚀 Start accepting payments!</li>
            </ul>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{frontendUrl}}/dashboard" class="button">Go to Dashboard</a>
            </p>
        </div>
    `;

    const variables = {
      ...data,
      frontendUrl: process.env.FRONTEND_URL || "https://advanciapayledger.com",
    };

    return {
      subject: "Welcome to Advancia Pay Ledger! 🎉",
      html: this.replaceVariables(baseTemplate(content, "Welcome"), variables),
      text: `Welcome to Advancia Pay Ledger! Hi ${
        data.name || "there"
      }, your account has been created. Visit ${
        variables.frontendUrl
      }/dashboard to get started.`,
    };
  }

  static paymentReceived(data: TemplateData): EmailTemplate {
    const content = `
        <div class="content">
            <h2>Payment Received! 💰</h2>
            <p>Hi {{name}},</p>
            <p>We've received your payment of <span class="highlight">{{amount}} {{currency}}</span>.</p>

            <h3>Payment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Transaction ID:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{transactionId}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{date}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Method:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{method}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Status:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><span style="color: #28a745;">Completed</span></td>
                </tr>
            </table>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{frontendUrl}}/transactions" class="button">View Transaction</a>
            </p>
        </div>
    `;

    const variables = {
      ...data,
      date: data.date || new Date().toLocaleDateString(),
      frontendUrl: process.env.FRONTEND_URL || "https://advanciapayledger.com",
    };

    return {
      subject: "Payment Received - Advancia Pay Ledger",
      html: this.replaceVariables(
        baseTemplate(content, "Payment Received"),
        variables
      ),
      text: `Payment received: ${data.amount || "0.00"} ${
        data.currency || "USD"
      }. Transaction ID: ${data.transactionId || "N/A"}`,
    };
  }

  static newsletterSubscription(data: TemplateData): EmailTemplate {
    const content = `
        <div class="content">
            <h2>Newsletter Subscription Confirmed! 🎉</h2>
            <p>Hi there,</p>
            <p>You've successfully subscribed to the Advancia Pay Ledger newsletter!</p>

            <h3>What You'll Receive:</h3>
            <ul>
                <li>🚀 Latest crypto payment features</li>
                <li>💡 Industry insights and trends</li>
                <li>🎯 Exclusive promotions and offers</li>
                <li>🔒 Security tips and best practices</li>
            </ul>

            <p>Stay tuned for exciting updates!</p>
        </div>
    `;

    const variables = {
      ...data,
      frontendUrl: process.env.FRONTEND_URL || "https://advanciapayledger.com",
    };

    return {
      subject: "Welcome to Advancia Pay Ledger Newsletter! 📧",
      html: this.replaceVariables(
        baseTemplate(content, "Newsletter Subscription"),
        variables
      ),
      text: `Thanks for subscribing to the Advancia Pay Ledger newsletter! Unsubscribe: ${variables.frontendUrl}/unsubscribe?email=${data.email}`,
    };
  }

  static passwordReset(data: TemplateData): EmailTemplate {
    const content = `
        <div class="content">
            <h2>Password Reset Request 🔐</h2>
            <p>Hi {{name}},</p>
            <p>We received a request to reset your password for your Advancia Pay Ledger account.</p>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{resetLink}}" class="button">Reset Password</a>
            </p>

            <p><strong>Important:</strong></p>
            <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Never share this link with anyone</li>
            </ul>
        </div>
    `;

    const variables = {
      ...data,
      frontendUrl: process.env.FRONTEND_URL || "https://advanciapayledger.com",
      resetLink:
        data.resetLink ||
        `${process.env.FRONTEND_URL}/reset-password?token=${data.token}`,
    };

    return {
      subject: "Password Reset - Advancia Pay Ledger",
      html: this.replaceVariables(
        baseTemplate(content, "Password Reset"),
        variables
      ),
      text: `Reset your password: ${variables.resetLink}. This link expires in 1 hour. If you didn't request this, please ignore this email.`,
    };
  }

  static invoice(data: TemplateData): EmailTemplate {
    const content = `
        <div class="content">
            <h2>Invoice #{{invoiceNumber}} 📄</h2>
            <p>Hi {{name}},</p>
            <p>Please find your invoice below for the services provided.</p>

            <h3>Invoice Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
                    <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount</th>
                </tr>
                {{#each items}}
                <tr>
                    <td style="padding: 12px; border: 1px solid #ddd;">{{description}}</td>
                    <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">\${{amount}}</td>
                </tr>
                {{/each}}
                <tr style="background: #f8f9fa; font-weight: bold;">
                    <td style="padding: 12px; border: 1px solid #ddd;">Total</td>
                    <td style="padding: 12px; text-align: right; border: 1px solid #ddd;">\${{total}}</td>
                </tr>
            </table>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{invoiceLink}}" class="button">View Full Invoice</a>
            </p>
        </div>
    `;

    const variables = {
      ...data,
      frontendUrl: process.env.FRONTEND_URL || "https://advanciapayledger.com",
    };

    return {
      subject: `Invoice #${data.invoiceNumber} - Advancia Pay Ledger`,
      html: this.replaceVariables(
        baseTemplate(content, `Invoice #${data.invoiceNumber}`),
        variables
      ),
      text: `Invoice #${data.invoiceNumber} for ${data.total}. View full invoice: ${variables.frontendUrl}/invoices/${data.invoiceId}`,
    };
  }

  static appointmentReminder(data: TemplateData): EmailTemplate {
    const content = `
        <div class="content">
            <h2>Appointment Reminder 📅</h2>
            <p>Hi {{name}},</p>
            <p>This is a friendly reminder about your upcoming appointment.</p>

            <h3>Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{date}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{time}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Location:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{location}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Provider:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">{{provider}}</td>
                </tr>
            </table>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{{appointmentLink}}" class="button">View Appointment</a>
            </p>

            <p><strong>Please arrive 15 minutes early.</strong></p>
        </div>
    `;

    const variables = {
      ...data,
      frontendUrl: process.env.FRONTEND_URL || "https://advanciapayledger.com",
    };

    return {
      subject: "Appointment Reminder - Advancia Pay Ledger",
      html: this.replaceVariables(
        baseTemplate(content, "Appointment Reminder"),
        variables
      ),
      text: `Reminder: Appointment on ${data.date} at ${data.time} with ${data.provider}. Location: ${data.location}`,
    };
  }

  static marketingUpdate(data: TemplateData): EmailTemplate {
    const content = `
        <div class="content">
            <h2>{{title}}</h2>
            <p>Hi {{name}},</p>
            <div>{{content}}</div>

            {{#if hasCTA}}
            <p style="text-align: center; margin: 30px 0;">
                <a href="{{ctaLink}}" class="button">{{ctaText}}</a>
            </p>
            {{/if}}
        </div>
    `;

    const variables = {
      ...data,
      frontendUrl: process.env.FRONTEND_URL || "https://advanciapayledger.com",
    };

    return {
      subject: data.subject || "Update from Advancia Pay Ledger",
      html: this.replaceVariables(baseTemplate(content, data.title), variables),
      text: `${data.title}\n\n${data.content}\n\n${data.ctaLink}`,
    };
  }
}

export default EmailTemplates;
