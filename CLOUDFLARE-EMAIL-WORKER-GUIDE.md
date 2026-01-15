# Cloudflare Email Worker - Advanced Setup Guide

**Advanced email routing with spam filtering, auto-responders, and webhook notifications**

---

## 🎯 What This Worker Does

### Features

✅ **Spam Filtering**
- Block list for known spammers
- Suspicious keyword detection
- Allow list for trusted senders

✅ **Smart Department Routing**
- Routes emails to correct department
- Custom headers for tracking
- Rejects unknown addresses

✅ **Instant Notifications**
- Slack webhooks for urgent emails
- Discord webhooks
- Real-time alerts for support/livechat

✅ **Auto-Responder**
- After-hours automatic replies
- Business hours detection
- Professional HTML emails

✅ **Analytics Tracking**
- Email metrics logging
- Department statistics
- Custom analytics endpoint integration

---

## 🚀 Quick Setup (10 minutes)

### Option 1: Simple Email Routing (Recommended First)

**Use the basic setup script:**
```bash
./setup-cloudflare-emails.sh
```

This creates simple forwarding rules without Workers. **Start here if you just need emails working.**

### Option 2: Advanced Email Worker (This Guide)

**Use when you need:**
- Spam filtering
- Auto-responders
- Webhook notifications
- Custom email processing logic

---

## 📋 Prerequisites

- ✅ Cloudflare account
- ✅ Domain on Cloudflare (advanciapayledger.com)
- ✅ Email routing enabled
- ✅ Node.js installed (for Wrangler CLI)

---

## 🛠️ Installation Steps

### Step 1: Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Step 2: Create Worker Project

```bash
# Create new worker directory
mkdir advancia-email-worker
cd advancia-email-worker

# Initialize worker
wrangler init

# Copy the worker code
cp ../cloudflare-email-worker.js src/index.js
```

### Step 3: Configure Worker

Edit `wrangler.toml`:

```toml
name = "advancia-email-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"
account_id = "74ecde4d46d4b399c7295cf599d2886b"

# Environment variables (optional)
[vars]
# Add any non-sensitive variables here

# Secrets (use wrangler secret put)
# SLACK_WEBHOOK_URL
# DISCORD_WEBHOOK_URL
# ANALYTICS_ENDPOINT
```

### Step 4: Update Worker Configuration

Edit `cloudflare-email-worker.js` line 18:

```javascript
destinationEmail: "your-email@gmail.com", // ⚠️ CHANGE THIS TO YOUR REAL EMAIL
```

### Step 5: Add Secrets (Optional)

```bash
# Add Slack webhook (optional)
wrangler secret put SLACK_WEBHOOK_URL
# Paste your Slack webhook URL when prompted

# Add Discord webhook (optional)
wrangler secret put DISCORD_WEBHOOK_URL
# Paste your Discord webhook URL when prompted

# Add analytics endpoint (optional)
wrangler secret put ANALYTICS_ENDPOINT
# Paste your analytics API endpoint when prompted
```

### Step 6: Deploy Worker

```bash
# Deploy to Cloudflare
wrangler deploy

# You'll get a worker URL like:
# https://advancia-email-worker.your-subdomain.workers.dev
```

### Step 7: Connect to Email Routing

**Via Cloudflare Dashboard:**

1. Go to: Cloudflare Dashboard → Email → Email Routing
2. Click: **Email Workers**
3. Click: **Create Email Worker**
4. Select: `advancia-email-worker`
5. Enable for all email addresses

**Or via API:**

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{
       "enabled": true,
       "name": "Route all emails through worker",
       "matchers": [{
         "type": "all"
       }],
       "actions": [{
         "type": "worker",
         "value": ["advancia-email-worker"]
       }]
     }'
```

---

## 🔧 Configuration Options

### Spam Filtering

Edit the `blockList` array in the worker:

```javascript
blockList: [
  "spam@example.com",
  "abuse@example.com",
  "hacker@malicious.com"
],
```

### Trusted Senders

Edit the `allowList` array:

```javascript
allowList: [
  "support@stripe.com",
  "noreply@github.com",
  "billing@aws.amazon.com"
],
```

### Suspicious Keywords

Customize spam detection:

```javascript
const suspiciousKeywords = [
  'viagra', 'casino', 'lottery', 'winner', 'urgent',
  'click here', 'act now', 'limited time', 'free money',
  'congratulations', 'claim your prize'
];
```

### Business Hours

Configure auto-responder timing:

```javascript
businessHours: {
  start: 9,  // 9 AM
  end: 17,   // 5 PM
  timezone: "America/New_York"
}
```

### Department Routing

Add or modify email addresses:

```javascript
case "sales@advanciapayledger.com":
  department = 'sales';
  shouldNotify = true;
  break;
```

---

## 🔔 Webhook Setup

### Slack Webhook

1. Go to: https://api.slack.com/messaging/webhooks
2. Create new webhook for your workspace
3. Copy webhook URL
4. Add to worker:

```bash
wrangler secret put SLACK_WEBHOOK_URL
# Paste: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Discord Webhook

1. Go to Discord Server Settings → Integrations → Webhooks
2. Create webhook
3. Copy webhook URL
4. Add to worker:

```bash
wrangler secret put DISCORD_WEBHOOK_URL
# Paste: https://discord.com/api/webhooks/YOUR/WEBHOOK/URL
```

---

## 🧪 Testing

### Test Email Processing

```bash
# Send test email
echo "Test email body" | mail -s "Test Subject" livechat@advanciapayledger.com

# Check worker logs
wrangler tail

# You should see:
# Email processed: {"timestamp":"...","from":"...","to":"livechat@advanciapayledger.com",...}
```

### Test Spam Filtering

```bash
# Add your email to block list temporarily
# Send email from that address
# Should be rejected

# Check logs
wrangler tail
# You should see: "Blocked email from: your-email@example.com"
```

### Test Auto-Responder

```bash
# Send email to support@ outside business hours
# Should receive auto-reply

# Check logs
wrangler tail
# You should see: "Auto-reply sent"
```

### Test Webhooks

```bash
# Send email to livechat@ or support@
# Check Slack/Discord for notification
```

---

## 📊 Monitoring & Logs

### View Real-Time Logs

```bash
# Stream logs
wrangler tail

# Filter by status
wrangler tail --status error

# Filter by method
wrangler tail --method POST
```

### Cloudflare Dashboard

1. Go to: Workers & Pages → advancia-email-worker
2. Click: **Logs** tab
3. View real-time email processing

### Metrics

1. Go to: Workers & Pages → advancia-email-worker
2. Click: **Metrics** tab
3. See:
   - Requests per second
   - Success rate
   - Errors
   - CPU time

---

## 🔒 Security Best Practices

### 1. Keep Secrets Secure

```bash
# Never commit secrets to git
# Always use wrangler secret put
# Rotate secrets regularly
```

### 2. Validate Input

The worker already includes:
- Email address validation
- Spam keyword detection
- Block list checking

### 3. Rate Limiting

Add rate limiting for webhook notifications:

```javascript
// In worker code
const rateLimiter = {
  lastNotification: {},
  minInterval: 60000, // 1 minute
  
  shouldNotify(email) {
    const now = Date.now();
    const last = this.lastNotification[email] || 0;
    if (now - last < this.minInterval) {
      return false;
    }
    this.lastNotification[email] = now;
    return true;
  }
};
```

### 4. Monitor Logs

```bash
# Set up alerts in Cloudflare dashboard
# Alert on error rate > 5%
# Alert on unusual traffic patterns
```

---

## 🆚 Comparison: Simple vs Advanced Setup

| Feature | Simple Setup (API) | Advanced Setup (Worker) |
|---------|-------------------|------------------------|
| **Setup Time** | 2 minutes | 10 minutes |
| **Complexity** | Very simple | Moderate |
| **Spam Filtering** | ❌ No | ✅ Yes |
| **Auto-Responder** | ❌ No | ✅ Yes |
| **Webhooks** | ❌ No | ✅ Yes |
| **Custom Logic** | ❌ No | ✅ Yes |
| **Analytics** | ❌ No | ✅ Yes |
| **Cost** | FREE | FREE (10k requests/day) |
| **Best For** | Quick setup, simple forwarding | Advanced features, custom logic |

---

## 💰 Pricing

**Cloudflare Workers Free Tier:**
- ✅ 100,000 requests/day
- ✅ 10ms CPU time per request
- ✅ More than enough for email routing

**Paid Plan ($5/month):**
- 10 million requests/month
- 50ms CPU time per request
- Only needed for high-volume businesses

**Email Routing:**
- ✅ FREE (unlimited)
- ✅ No limits on forwarding

---

## 🐛 Troubleshooting

### Worker Not Receiving Emails

```bash
# Check worker is deployed
wrangler deployments list

# Check email routing rules
curl -X GET "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-"

# Verify worker is connected to email routing
# Go to: Cloudflare Dashboard → Email → Email Workers
```

### Emails Not Forwarding

```bash
# Check destination email is verified
# Go to: Cloudflare Dashboard → Email → Destination addresses

# Check worker logs for errors
wrangler tail --status error

# Verify destinationEmail in worker code
```

### Webhooks Not Working

```bash
# Test webhook URL manually
curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"text":"Test message"}'

# Check worker logs
wrangler tail

# Verify secret is set
wrangler secret list
```

### Auto-Responder Not Sending

```bash
# Check business hours configuration
# Verify email is to support@
# Check worker logs for errors
wrangler tail

# Test outside business hours
```

---

## 🚀 Advanced Customizations

### Add Database Logging

```javascript
// Store email data in D1 database
if (env.DB) {
  await env.DB.prepare(
    'INSERT INTO emails (timestamp, from_email, to_email, subject) VALUES (?, ?, ?, ?)'
  ).bind(
    new Date().toISOString(),
    message.from,
    emailTo,
    subject
  ).run();
}
```

### Add AI Spam Detection

```javascript
// Use Cloudflare AI to detect spam
if (env.AI) {
  const result = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
    prompt: `Is this email spam? Subject: ${subject}. Reply with YES or NO.`
  });
  
  if (result.response.includes('YES')) {
    message.setReject("Detected as spam by AI");
    return;
  }
}
```

### Add Email Parsing

```javascript
// Parse email content
const emailContent = await new Response(message.raw).text();

// Extract links
const links = emailContent.match(/https?:\/\/[^\s]+/g) || [];

// Check for phishing
const suspiciousDomains = ['bit.ly', 'tinyurl.com'];
const hasPhishing = links.some(link => 
  suspiciousDomains.some(domain => link.includes(domain))
);
```

---

## 📚 Resources

**Cloudflare Docs:**
- Email Workers: https://developers.cloudflare.com/email-routing/email-workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- Workers Examples: https://developers.cloudflare.com/workers/examples/

**Webhook Guides:**
- Slack: https://api.slack.com/messaging/webhooks
- Discord: https://discord.com/developers/docs/resources/webhook

---

## ✅ Quick Start Checklist

```
☐ Install Wrangler CLI (npm install -g wrangler)
☐ Login to Cloudflare (wrangler login)
☐ Create worker project
☐ Copy cloudflare-email-worker.js
☐ Update destinationEmail in code
☐ Configure wrangler.toml
☐ Deploy worker (wrangler deploy)
☐ Connect to email routing
☐ Add webhooks (optional)
☐ Test email forwarding
☐ Test spam filtering
☐ Test auto-responder
☐ Monitor logs (wrangler tail)
```

---

## 🎯 Recommendation

**For most users: Start with Simple Setup**
- Run `./setup-cloudflare-emails.sh`
- Get emails working in 2 minutes
- Upgrade to Worker later if needed

**Use Worker if you need:**
- Spam filtering
- Auto-responders
- Webhook notifications
- Custom email processing
- Analytics tracking

Both options are FREE and can coexist!

---

## 💡 Next Steps

1. **Now:** Use simple setup to get emails working
2. **Later:** Add Worker for advanced features
3. **Future:** Integrate with backend for full automation

The worker is ready to deploy whenever you need advanced features!
