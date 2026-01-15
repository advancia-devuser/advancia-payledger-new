# Email Service Setup Guide - Advancia Pay Ledger

## Overview

Advancia Pay Ledger supports multiple email service providers with automatic fallback:

1. **Postmark** (Primary) - Transactional email service
2. **Resend** (Alternative) - Modern email API
3. **Zoho Mail** (SMTP) - Business email hosting
4. **Gmail SMTP** (Development) - Testing and development

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Email Service Configuration
EMAIL_FROM=noreply@advanciapayledger.com
ADMIN_EMAIL=admin@advanciapayledger.com

# Postmark (Recommended for production)
POSTMARK_API_KEY=your-postmark-server-api-token
POSTMARK_SERVER_ID=your-server-id

# Resend (Alternative)
RESEND_API_KEY=your-resend-api-key

# SMTP Configuration (Zoho Mail)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=your-email@zoho.com
SMTP_PASS=your-zoho-app-password

# Alternative SMTP (Gmail for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

## Provider Setup

### 1. Postmark Setup

1. **Create Account**: Sign up at [Postmark](https://postmarkapp.com)
2. **Create Server**:
   - Go to Servers → Create Server
   - Set name: "Advancia Pay Ledger"
   - Configure inbound/outbound settings
3. **Get API Keys**:
   - Server ID: Found in server settings
   - API Token: Create API token with "Servers" permission
4. **Verify Domain**:
   - Add DNS records for SPF, DKIM, and return-path
   - Wait for verification (usually 1-2 hours)

### 2. Resend Setup

1. **Create Account**: Sign up at [Resend](https://resend.com)
2. **Get API Key**:
   - Go to API Keys → Create API Key
   - Copy the API key
3. **Verify Domain**:
   - Add domain in Resend dashboard
   - Add DNS records for DKIM and SPF
   - Wait for verification

### 3. Zoho Mail Setup

1. **Create Account**: Sign up at [Zoho Mail](https://zoho.com/mail)
2. **Enable SMTP**:
   - Go to Mail Settings → SMTP
   - Enable SMTP access
   - Generate app password (not regular password)
3. **Get SMTP Details**:
   - Host: smtp.zoho.com
   - Port: 587 (TLS) or 465 (SSL)
   - Username: your-email@zoho.com
   - Password: Generated app password

### 4. Gmail SMTP (Development Only)

1. **Enable 2FA**: Go to Google Account settings
2. **Generate App Password**:
   - Go to Security → App Passwords
   - Create new app password for "Advancia Pay Ledger"
   - Use this password, not your regular password
3. **SMTP Details**:
   - Host: smtp.gmail.com
   - Port: 587 (TLS)
   - Username: your-email@gmail.com
   - Password: Generated app password

## Usage Examples

### Basic Email Sending

```typescript
import { sendEmail } from "../lib/emailService";

// Send with automatic provider fallback
const result = await sendEmail({
  from: "noreply@advanciapayledger.com",
  to: "user@example.com",
  subject: "Welcome to Advancia Pay Ledger",
  html: "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
});

// Send with specific provider
const result = await sendEmail(
  {
    from: "noreply@advanciapayledger.com",
    to: "user@example.com",
    subject: "Welcome to Advancia Pay Ledger",
    html: "<h1>Welcome!</h1><p>Thanks for joining us.</p>",
  },
  "postmark"
);
```

### Using Email Templates

```typescript
import { EmailTemplates } from "../lib/emailTemplates";

// Generate welcome email
const welcomeEmail = EmailTemplates.welcome({
  name: "John Doe",
  email: "john@example.com",
});

// Send the template
await sendEmail({
  from: "noreply@advanciapayledger.com",
  to: "john@example.com",
  subject: welcomeEmail.subject,
  html: welcomeEmail.html,
  text: welcomeEmail.text,
});
```

### API Endpoints

#### Send Email

```http
POST /api/email/send
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Test Email",
  "html": "<h1>Test</h1>",
  "provider": "postmark"
}
```

#### Test All Providers

```http
POST /api/email/test
```

#### Get Provider Status

```http
GET /api/email/status
```

#### Send Template Email

```http
POST /api/email/template
Content-Type: application/json

{
  "template": "welcome",
  "to": "user@example.com",
  "data": {
    "name": "John Doe"
  },
  "provider": "postmark"
}
```

## Available Templates

1. **welcome** - New user registration
2. **payment-received** - Payment confirmation
3. **newsletter-subscription** - Newsletter signup
4. **password-reset** - Password reset request
5. **invoice** - Invoice generation
6. **appointment-reminder** - Appointment notifications
7. **marketing-update** - Marketing communications

## Fallback Strategy

The email service automatically falls back in this order:

1. **Postmark** (if configured)
2. **Resend** (if configured)
3. **SMTP/Zoho** (if configured)
4. **SMTP/Gmail** (if configured)

If a provider fails, it automatically tries the next one in the list.

## Testing

### Test All Providers

```bash
curl -X POST http://localhost:4000/api/email/test
```

### Test Specific Email

```bash
curl -X POST http://localhost:4000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>",
    "provider": "postmark"
  }'
```

### Check Provider Status

```bash
curl http://localhost:4000/api/email/status
```

## Best Practices

### 1. Use Postmark for Production

- Highest deliverability rates
- Excellent analytics and tracking
- Built-in bounce handling
- SPF/DKIM authentication

### 2. Configure Proper DNS Records

```dns
# SPF Record
v=spf1 include:spf.postmarkapp.com include:_spf.google.com ~all

# DKIM Records (Postmark)
k=rsa; t=s; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...

# DMARC Record
_dmarc.yourdomain.com. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### 3. Monitor Email Metrics

- Delivery rates
- Open rates
- Click rates
- Bounce rates
- Spam complaints

### 4. Handle Bounces and Spam

- Set up webhook endpoints for bounces
- Automatically unsubscribe bounced emails
- Monitor spam complaint rates

### 5. Use Templates Consistently

- Maintain brand consistency
- Use responsive design
- Include plain text versions
- Test across email clients

## Troubleshooting

### Common Issues

1. **Authentication Failed**

   - Check API keys/tokens
   - Verify app passwords (not regular passwords)
   - Ensure 2FA is enabled for Gmail

2. **Domain Not Verified**

   - Add DNS records correctly
   - Wait for propagation (1-2 hours)
   - Use DNS lookup tools to verify

3. **Emails Going to Spam**

   - Check SPF/DKIM configuration
   - Verify sender reputation
   - Review email content for spam triggers

4. **Rate Limiting**
   - Implement proper rate limiting
   - Use batch sending for newsletters
   - Monitor provider limits

### Debug Mode

Enable debug logging:

```bash
DEBUG=email:* npm run dev
```

## Security Considerations

1. **Never commit API keys** to version control
2. **Use environment variables** for all credentials
3. **Rotate API keys** regularly
4. **Monitor usage** for unusual activity
5. **Implement rate limiting** to prevent abuse
6. **Validate email inputs** to prevent injection

## Monitoring and Analytics

### Postmark Analytics

- Delivery rates by domain
- Open and click tracking
- Bounce and spam analysis
- Geographic distribution

### Custom Monitoring

```typescript
// Add to your monitoring system
import { getEmailProviderStatus } from "../lib/emailService";

const status = getEmailProviderStatus();
console.log("Email provider status:", status);
```

## Migration Guide

### From Single Provider to Multi-Provider

1. **Backup current configuration**
2. **Add new provider credentials**
3. **Test new provider independently**
4. **Update fallback order if needed**
5. **Monitor delivery rates**
6. **Gradually migrate traffic**

### Provider Switching

To change primary provider:

```typescript
// In emailService.ts or environment-specific config
const DEFAULT_EMAIL_PROVIDER: EmailProvider = "resend"; // Change from 'postmark'
```

## Support

For provider-specific issues:

- **Postmark**: support@postmarkapp.com
- **Resend**: support@resend.com
- **Zoho Mail**: support@zoho.com
- **Gmail**: Google Workspace support

For integration issues:

- Check the error logs
- Verify environment variables
- Test provider connectivity
- Review DNS configuration
