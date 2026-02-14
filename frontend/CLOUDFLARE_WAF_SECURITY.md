# Cloudflare WAF Security Configuration for Advancia Pay Ledger

## Recommended Security Architecture

### 1. Web Application Exploits (Priority: CRITICAL)
**Current Status:** 4 active rules ✅

#### Enable OWASP Core Rule Set
```
- SQLi (SQL Injection): BLOCK
- XSS (Cross-Site Scripting): BLOCK
- Local File Inclusion (LFI): BLOCK
- Remote File Inclusion (RFI): BLOCK
- PHP Injection: BLOCK
- Cross-Protocol Scripting: BLOCK
```

#### Advanced Protection Rules
- **Log4j/Struts RCE**: BLOCK
- **Shellshock**: BLOCK
- **Apache Struts Exploit**: BLOCK
- **WordPress Plugin Exploits**: BLOCK

**Action:** Challenge suspicious → Block malicious

---

### 2. DDoS Attacks (Priority: HIGH)
**Recommended Settings:**

#### Rate Limiting Rules
```
Path: /api/*
Rate: 100 requests/10 seconds per IP
Action: CHALLENGE (1st violation) → BLOCK (2+ violations)
```

```
Path: /auth/login
Rate: 5 requests/minute per IP
Action: CHALLENGE (invalid credentials) → BLOCK
Duration: 15 minutes
```

```
Path: /payments/*
Rate: 50 requests/minute per IP
Action: BLOCK immediately
Reason: Sensitive endpoint
```

#### Layer 7 DDoS Protection
- **Enable:** Advanced TCP protection
- **Enable:** UDP flood protection
- **Enable:** UDP attack protection
- **Sensitivity:** High

#### Page Rule for API
```
URL: advancia.io/api/*
Security Level: High (IP reputation)
Cache Level: Bypass
```

---

### 3. Bot Traffic (Priority: HIGH)
**Current Status:** 1/2 running - NEEDS SETUP

#### Enable Bot Management
- **Verified Bots:** ALLOW (Google, Bing, CloudFlare)
- **Likely Bots:** CHALLENGE
- **Categorized Bots:** 
  - Search Engine Crawlers: ALLOW
  - Monitoring/Analytics: ALLOW
  - AI Crawlers: BLOCK (Privacy)
  - Scrapers: BLOCK

#### AI Bot Protection
✅ **Enable AI Labyrinth:**
```
- Mislead AI crawlers (GPT, Claude, etc.)
- Non-intrusive to legitimate users
- Cost: $0 (bundled with Enterprise)
```

#### Anti-Bot Rules
```
Path: /api/payments/*
Rule: Block likely bots
Action: BLOCK

Path: /auth/*
Rule: Block suspicious bots
Action: CHALLENGE
```

---

### 4. API Abuse (Priority: CRITICAL)
**Current Status:** 0 endpoints configured - NEEDS SETUP

#### Define API Schema
```yaml
Endpoint: POST /api/payments/send
Method: POST
Required Headers: Authorization, Content-Type
Rate Limit: 50/minute per user
Authentication: Bearer token (JWT)
Validation: 
  - amount: number [0.01-10000000]
  - recipient: string (email/address)
  - currency: enum [BTC, ETH, USDC]

Endpoint: POST /api/healthcare/claims
Method: POST
Rate Limit: 10/day per user
Authentication: Bearer token
Validation:
  - claim_type: enum [medical, dental, vision]
  - amount: number [1-1000000]
```

#### Session Identifier Setup
```
Cookie: session_id
Requirement: All API calls
Expire: 30 minutes (idle)
```

#### Endpoint Protection
- **Monitor:** All /api/* endpoints
- **Block:** Requests missing JWT token
- **Block:** Request rate >100 per minute per token
- **Log:** All unauthorized attempted access

---

### 5. Client-Side Abuse (Priority: MEDIUM)
**Recommended Rules:**

#### Content Security Policy (CSP)
```
Content-Security-Policy:
  default-src 'self'
  script-src 'self' cdn.jsdelivr.net analytics.cloudflare.com
  style-src 'self' 'unsafe-inline' cdn.jsdelivr.net
  img-src 'self' https: data:
  font-src 'self' cdn.jsdelivr.net
  connect-src 'self' api.advancia.io
  frame-ancestors 'none'
  form-action 'self'
  base-uri 'self'
  report-uri https://advancia.io/csp-report
```

#### Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: 
  geolocation=(),
  camera=(),
  microphone=(),
  payment=('self')
Strict-Transport-Security: 
  max-age=31536000; includeSubDomains; preload
```

---

## Complete WAF Rules Configuration

### Priority 1: CRITICAL (Implement Immediately)

```
1. OWASP Core Rule Set
   - Level: High
   - Action: Block + Alert
   - Mitigate: SQLi, XSS, LFI, RFI

2. Rate Limiting
   - API endpoints: 100/min per IP
   - Login: 5/min per IP
   - Payments: 50/min per user
   - Action: CHALLENGE → BLOCK

3. API Authentication
   - Require JWT on all /api/*
   - Session timeout: 30 min
   - Action: BLOCK missing token

4. Bot Management
   - Block suspicious bots
   - Allow verified bots
   - Action: CHALLENGE → BLOCK
```

### Priority 2: HIGH (Implement Within 1 Week)

```
5. Geographic Restrictions
   - Allow: Regions using service
   - Block: High-risk countries
   - Action: CHALLENGE

6. IP Reputation
   - Block: Known malicious IPs
   - Challenge: Suspicious IPs
   - Allow: Whitelisted IPs

7. SSL/TLS Settings
   - Minimum TLS: 1.2
   - Certificate: Auto-renew
   - HSTS: 1 year
```

### Priority 3: MEDIUM (Implement Within 1 Month)

```
8. Advanced Bot Rules
   - Fingerprint anomalies
   - Behavioral analysis
   - Account takeover detection

9. API Rate Limiting (Per-Endpoint)
   - Create: 5/sec
   - Read: 100/sec per user
   - Update: 10/sec per resource
   - Delete: 1/sec per resource

10. Monitoring & Alerting
    - Alert on spike: >200% traffic
    - Alert on block spike: >50 blocks/min
    - Daily digest: Security events
```

---

## Custom Rules Examples

### Rule 1: Block SQL Injection Attempts
```
When: URI Path contains /api/ 
AND Query String contains: ' OR '1'='1
Action: BLOCK
```

### Rule 2: Require API Key for Premium Endpoints
```
When: Request to /api/payments/* 
AND Header "X-API-Key" is missing
Action: BLOCK with 401
```

### Rule 3: Geo-Restrict Payments
```
When: POST /api/payments/*
AND Country NOT IN (US, CA, GB, AU, DE, FR)
Action: CHALLENGE + require email verification
```

### Rule 4: AI/Scraper Bot Protection
```
When: User-Agent contains (ChatGPT, Claude, GPT-4)
OR Request Header missing "Accept-Language"
Action: SERVE AI LABYRINTH (challenge maze)
```

### Rule 5: Prevent Credential Stuffing
```
When: POST /auth/login
AND Failed attempts > 3 in 5 minutes
AND From same IP
Action: BLOCK for 30 minutes
Log: Alert security team
```

---

## Monitoring & Alerts Setup

### Dashboard Metrics
- **Real-time:** Request rate, threat level
- **Daily:** Top threats, blocked countries
- **Weekly:** Security incidents, anomalies

### Alert Triggers
```
Alert if:
- Traffic spike > 300% in 5 min
- Block rate > 10% of total traffic
- API endpoint errors > 5% 
- DDoS attack detected
- Unusual geographic pattern
```

### Logging Configuration
```
Send logs to:
- Cloudflare Logpush → S3 bucket
- Cloudflare Analytics Engine
- SIEM: Datadog or Splunk (Enterprise)
- Slack webhook for critical events
```

---

## Rollout Plan

### Week 1: Foundation
- ✅ Enable OWASP Core Rule Set
- ✅ Configure rate limiting
- ✅ Set up API authentication

### Week 2: Protection
- ✅ Enable bot management
- ✅ Add API schema validation
- ✅ Configure security headers

### Week 3: Optimization
- ✅ Fine-tune false positives
- ✅ Add geo-restrictions
- ✅ Enable advanced monitoring

### Week 4: Hardening
- ✅ Advanced bot detection
- ✅ Anomaly detection
- ✅ Setup SIEM integration

---

## Testing & Validation

### OWASP Testing
```bash
# Test SQLi protection
curl "https://advancia.io/api/users?id=1' OR '1'='1"
# Expected: 403 Forbidden

# Test XSS protection
curl "https://advancia.io?search=<script>alert('xss')</script>"
# Expected: 403 Forbidden

# Test rate limiting
for i in {1..150}; do curl https://advancia.io/api/payments; done
# Expected: 429 Too Many Requests after limit
```

---

## Cost Estimation (Cloudflare Plans)

| Feature | Free | Pro | Business | Enterprise |
|---------|------|-----|----------|-----------|
| DDoS Protection | ✅ | ✅ | ✅ | ✅ |
| OWASP ModSecurity | ✅ | ✅ | ✅ | ✅ |
| Rate Limiting Rules | - | 10 | Unlimited | Unlimited |
| Advanced Bot Mgmt | - | - | ✅ | ✅ |
| Custom Rules | - | 5 | 100 | Unlimited |
| API Shield | - | - | - | ✅ |
| Monthly Cost | $0 | $20+ | $200+ | Custom |

**Recommendation:** Start with Pro ($20/month), upgrade to Business ($200/month) once product-market fit confirmed.

---

## Compliance & Standards

- ✅ **OWASP Top 10**: Covered by OWASP CRS
- ✅ **PCI DSS**: Rate limiting, authentication
- ✅ **HIPAA**: (if used for healthcare data) Encryption + access logs
- ✅ **GDPR**: DPA with Cloudflare, data residency options
- ✅ **SOC 2**: Audit logs, rate limiting

---

## Next Steps

1. **Login to Cloudflare Dashboard**
2. **Go to:** Security → WAF (Web Application Firewall)
3. **Implement:** OWASP Core Rule Set
4. **Configure:** Custom rules (as shown above)
5. **Monitor:** Real-time dashboard for 1 week
6. **Adjust:** False positive rules
7. **Enable:** Advanced features progressively

