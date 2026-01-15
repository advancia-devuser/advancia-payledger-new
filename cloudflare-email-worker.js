/**
 * Cloudflare Email Worker - Advancia Pay Ledger
 * 
 * Advanced email routing with:
 * - Spam filtering
 * - Department routing
 * - Webhook notifications
 * - Auto-responders
 * - Analytics tracking
 */

export default {
  async email(message, env, ctx) {
    
    // ============================================
    // CONFIGURATION
    // ============================================
    
    const config = {
      // Your destination email (where all emails forward to)
      destinationEmail: "your-email@gmail.com", // ⚠️ CHANGE THIS
      
      // Spam/Block list
      blockList: [
        "spam@example.com",
        "abuse@example.com",
      ],
      
      // Trusted senders (bypass all filters)
      allowList: [
        "support@stripe.com",
        "noreply@github.com",
      ],
      
      // Webhook for notifications (optional)
      slackWebhook: env.SLACK_WEBHOOK_URL || null,
      discordWebhook: env.DISCORD_WEBHOOK_URL || null,
      
      // Auto-responder settings
      autoRespond: {
        enabled: true,
        businessHours: {
          start: 9, // 9 AM
          end: 17,  // 5 PM
          timezone: "America/New_York"
        }
      }
    };
    
    // ============================================
    // SPAM FILTERING
    // ============================================
    
    // Check block list
    if (config.blockList.includes(message.from)) {
      console.log(`Blocked email from: ${message.from}`);
      message.setReject("Address is blocked");
      return;
    }
    
    // Check for suspicious patterns
    const subject = message.headers.get('subject') || '';
    const suspiciousKeywords = [
      'viagra', 'casino', 'lottery', 'winner', 'urgent',
      'click here', 'act now', 'limited time', 'free money'
    ];
    
    const isSuspicious = suspiciousKeywords.some(keyword => 
      subject.toLowerCase().includes(keyword)
    );
    
    if (isSuspicious && !config.allowList.includes(message.from)) {
      console.log(`Suspicious email detected: ${subject}`);
      // Still forward but mark as spam
      await message.forward(config.destinationEmail, {
        headers: {
          'X-Spam-Flag': 'YES',
          'X-Spam-Reason': 'Suspicious keywords detected'
        }
      });
      return;
    }
    
    // ============================================
    // DEPARTMENT ROUTING
    // ============================================
    
    const emailTo = message.to.toLowerCase();
    let department = 'general';
    let shouldNotify = false;
    
    switch (emailTo) {
      case "livechat@advanciapayledger.com":
        department = 'livechat';
        shouldNotify = true; // Immediate notification
        break;
        
      case "support@advanciapayledger.com":
        department = 'support';
        shouldNotify = true;
        break;
        
      case "billing@advanciapayledger.com":
        department = 'billing';
        shouldNotify = true;
        break;
        
      case "admin@advanciapayledger.com":
        department = 'admin';
        shouldNotify = true;
        break;
        
      case "info@advanciapayledger.com":
        department = 'info';
        shouldNotify = false;
        break;
        
      case "noreply@advanciapayledger.com":
        // Don't forward noreply emails back
        console.log(`Ignoring email to noreply address`);
        return;
        
      default:
        console.log(`Unknown email address: ${emailTo}`);
        message.setReject("Unknown address");
        return;
    }
    
    // ============================================
    // WEBHOOK NOTIFICATIONS
    // ============================================
    
    if (shouldNotify) {
      // Send Slack notification
      if (config.slackWebhook) {
        try {
          await fetch(config.slackWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `📧 New ${department.toUpperCase()} Email`,
              blocks: [
                {
                  type: "header",
                  text: {
                    type: "plain_text",
                    text: `📧 New ${department.toUpperCase()} Email`
                  }
                },
                {
                  type: "section",
                  fields: [
                    {
                      type: "mrkdwn",
                      text: `*From:*\n${message.from}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*To:*\n${emailTo}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*Subject:*\n${subject}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*Time:*\n${new Date().toLocaleString()}`
                    }
                  ]
                }
              ]
            })
          });
        } catch (error) {
          console.error('Slack notification failed:', error);
        }
      }
      
      // Send Discord notification
      if (config.discordWebhook) {
        try {
          await fetch(config.discordWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                title: `📧 New ${department.toUpperCase()} Email`,
                color: 0x7c3aed, // Purple
                fields: [
                  { name: 'From', value: message.from, inline: true },
                  { name: 'To', value: emailTo, inline: true },
                  { name: 'Subject', value: subject || '(no subject)', inline: false },
                ],
                timestamp: new Date().toISOString()
              }]
            })
          });
        } catch (error) {
          console.error('Discord notification failed:', error);
        }
      }
    }
    
    // ============================================
    // AUTO-RESPONDER
    // ============================================
    
    if (config.autoRespond.enabled && department === 'support') {
      const now = new Date();
      const hour = now.getHours();
      const isBusinessHours = hour >= config.autoRespond.businessHours.start && 
                              hour < config.autoRespond.businessHours.end;
      
      if (!isBusinessHours) {
        // Send auto-reply for after-hours support emails
        try {
          await message.reply({
            from: emailTo,
            subject: `Re: ${subject}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
                  .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Thank You for Contacting Advancia Pay</h2>
                  </div>
                  <div class="content">
                    <p>Hi there,</p>
                    <p>Thank you for reaching out to our support team. We've received your message and will respond during our next business hours.</p>
                    <p><strong>Business Hours:</strong><br>
                    Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                    <p>For urgent matters, please visit our <a href="https://advanciapayledger.com/help">Help Center</a> or use our live chat feature.</p>
                    <p>Best regards,<br>
                    <strong>Advancia Pay Support Team</strong></p>
                  </div>
                  <div class="footer">
                    <p>© 2026 Advancia Pay Ledger. All rights reserved.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          });
        } catch (error) {
          console.error('Auto-reply failed:', error);
        }
      }
    }
    
    // ============================================
    // ANALYTICS TRACKING (Optional)
    // ============================================
    
    // Track email metrics
    const emailData = {
      timestamp: new Date().toISOString(),
      from: message.from,
      to: emailTo,
      department: department,
      subject: subject,
      size: message.rawSize || 0
    };
    
    // Log to console (visible in Cloudflare dashboard)
    console.log('Email processed:', JSON.stringify(emailData));
    
    // Optional: Send to analytics service
    if (env.ANALYTICS_ENDPOINT) {
      ctx.waitUntil(
        fetch(env.ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData)
        }).catch(error => console.error('Analytics failed:', error))
      );
    }
    
    // ============================================
    // FORWARD EMAIL
    // ============================================
    
    // Add custom headers for tracking
    await message.forward(config.destinationEmail, {
      headers: {
        'X-Advancia-Department': department,
        'X-Advancia-Original-To': emailTo,
        'X-Advancia-Processed': new Date().toISOString()
      }
    });
    
    console.log(`Email forwarded: ${emailTo} -> ${config.destinationEmail}`);
  }
};
