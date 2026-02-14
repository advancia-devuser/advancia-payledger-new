# Cloudflare WAF Setup - Quick Start Guide

## Prerequisites

1. **Cloudflare Account** (free tier available)
   - Sign up: https://dash.cloudflare.com/login
   
2. **API Token**
   - Go to: Account → API Tokens
   - Click: Create Token
   - Select: Edit zone DNS template
   - Copy the token

3. **Zone ID**
   - Go to: Your domain dashboard
   - Check: Right sidebar for Zone ID
   - Copy the ID

4. **Terraform Installed**
   - Download: https://www.terraform.io/downloads.html
   - Or: `brew install terraform` (Mac) / `choco install terraform` (Windows)

---

## Automated Setup (Recommended)

### Option 1: PowerShell (Windows)
```powershell
cd "C:\Users\mucha.DESKTOP-H7T9NPM\Downloads\mdsiles\myproject\advancia-deployed\frontend"
.\scripts\setup-cloudflare-waf.ps1
```

### Option 2: Bash (Linux/Mac)
```bash
cd ~/path/to/advancia-deployed/frontend
chmod +x scripts/setup-cloudflare-waf.sh
./scripts/setup-cloudflare-waf.sh
```

---

## Manual Setup (Alternative)

### Step 1: Initialize Terraform
```bash
cd terraform
terraform init
```

### Step 2: Create credentials file
Create `terraform/terraform.tfvars`:
```
cloudflare_api_token = "your_api_token_here"
zone_id              = "your_zone_id_here"
domain               = "advancia.io"
```

### Step 3: Review configuration
```bash
terraform plan
```

### Step 4: Apply security rules
```bash
terraform apply
```

---

## What Gets Configured

| Component | Setting | Value |
|-----------|---------|-------|
| OWASP Rules | SQLi | BLOCK |
| | XSS | BLOCK |
| Rate Limiting | API | 100 req/10 sec |
| | Login | 5 req/min |
| | Payments | 50 req/min |
| Firewall Rules | Custom | 5 rules |
| Bot Management | Enabled | Yes |
| SSL/TLS | Min Version | 1.2 |
| | HTTP/3 | Enabled |

---

## Verification

### In Cloudflare Dashboard:
1. Go to: **Security → WAF**
2. Check: Enabled rules (should show ~4 active)
3. Go to: **Security → DDoS**
4. Verify: Layer 7 protection enabled

### Monitor Live Traffic:
1. **Analytics → Security**
2. View blocked requests in real-time
3. Check for false positives

---

## Post-Setup Actions

### 1. Adjust False Positives
- Monitor for 48 hours
- Review "Blocked" requests
- Add exceptions if needed:
  ```
  firewall_rule "whitelist_trusted_ips" {
    filter_id = cloudflare_firewall_filter.trusted_ips.id
    action    = "allow"
  }
  ```

### 2. Enable Advanced Features (Optional)
- Go to Dashboard → Security
- Enable: **Bot Management** (extra bot protection)
- Enable: **Advanced DDoS** (Layer 3/4 attack)
- Enable: **API Shield** (requires Business plan)

### 3. Set Up Alerts
- Analytics → Notifications
- Click: **Create Notification**
- Event: **Firewall Blocked Traffic**
- Set threshold: >50 blocks/min
- Notification: Email or Slack

### 4. Create Custom Rules as Needed
Example: Block requests from specific country (except payments):
```
firewall_rule "geo_block_except_payments" {
  filter_id = firewall_filter.geo_filter.id
  action    = "challenge"
}

firewall_filter "geo_filter" {
  expression = "(cf.country == \"CN\") AND NOT (http.request.uri.path contains \"/api/healthcare\")"
}
```

---

## Rollback (If Issues)

```bash
# Undo all changes
terraform destroy

# Or selectively remove one rule
terraform destroy -target=cloudflare_rate_limit.api_general
```

---

## Troubleshooting

### Issue: "API token invalid"
- **Solution:** Verify token in Cloudflare dashboard
- Regenerate if expired
- Ensure proper permissions

### Issue: "Zone ID not found"
- **Solution:** Copy from dashboard sidebar
- Format: Alphanumeric string (32 chars)

### Issue: Legitimate traffic blocked
- **Solution:** Add exceptions:
  ```
  resource "cloudflare_ip_list" "whitelist" {
    account_id = var.account_id
    name       = "trusted_ips"
    description = "Trusted IPs"
    items = [
      "203.0.113.0",
      "203.0.113.1"
    ]
  }
  ```

### Issue: Terraform can't find provider
- **Solution:** Run `terraform init` again
- Update Terraform: `terraform upgrade`

---

## Performance Impact

After setup, expect:
- ✅ Slightly faster (caching enabled)
- ✅ More security (minimal latency)
- 📊 Average TTFB: +2-5ms (negligible)
- 📊 Cache hit rate: 60-80%

---

## Cost

**Cloudflare Plans:**
| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| OWASP Rules | ✅ | ✅ | ✅ |
| Rate Limiting | - | 10 | Unlimited |
| Custom Rules | - | 5 | 100 |
| Bot Mgmt | - | - | ✅ |
| Monthly | $0 | $20 | $200 |

**Recommendation:** Start Pro, upgrade to Business after PMF.

---

## Support

- **Cloudflare Docs:** https://developers.cloudflare.com/
- **Terraform Docs:** https://registry.terraform.io/providers/cloudflare/cloudflare/latest
- **Issue Tracker:** https://github.com/pdtribe181-prog/advancia-payledger/issues

---

## Next Steps

1. ✅ Run setup script
2. ✅ Verify rules in dashboard
3. ✅ Monitor for 48 hours
4. ✅ Adjust false positives
5. ✅ Enable advanced features (Business plan)
6. ✅ Set up alerting & monitoring
