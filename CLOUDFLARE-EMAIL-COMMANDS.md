# Cloudflare Email Routing - Manual Commands

**Domain:** advanciapayledger.com  
**Zone ID:** `0bff66558872c58ed5b8b7942acc34d9`  
**API Token:** `5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-`

⚠️ **SECURITY:** Keep this file private! Contains API credentials.

---

## Step 1: Verify API Token

```bash
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json"
```

**Expected:** `"success":true`

---

## Step 2: Enable Email Routing

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/enable" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json"
```

**Expected:** `"success":true` or "already enabled"

---

## Step 3: Create Destination Address

⚠️ **REPLACE** `your-email@gmail.com` with your actual email!

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/addresses" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{"email":"your-email@gmail.com"}'
```

**Action Required:** Check your email inbox and click verification link!

---

## Step 4: Create Email Forwarding Rules

### 4.1 livechat@advanciapayledger.com (MAIN REQUEST)

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{
       "matchers": [{
         "type": "literal",
         "field": "to",
         "value": "livechat@advanciapayledger.com"
       }],
       "actions": [{
         "type": "forward",
         "value": ["your-email@gmail.com"]
       }],
       "enabled": true,
       "name": "Forward livechat to destination"
     }'
```

### 4.2 support@advanciapayledger.com

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{
       "matchers": [{
         "type": "literal",
         "field": "to",
         "value": "support@advanciapayledger.com"
       }],
       "actions": [{
         "type": "forward",
         "value": ["your-email@gmail.com"]
       }],
       "enabled": true,
       "name": "Forward support to destination"
     }'
```

### 4.3 billing@advanciapayledger.com

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{
       "matchers": [{
         "type": "literal",
         "field": "to",
         "value": "billing@advanciapayledger.com"
       }],
       "actions": [{
         "type": "forward",
         "value": ["your-email@gmail.com"]
       }],
       "enabled": true,
       "name": "Forward billing to destination"
     }'
```

### 4.4 admin@advanciapayledger.com

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{
       "matchers": [{
         "type": "literal",
         "field": "to",
         "value": "admin@advanciapayledger.com"
       }],
       "actions": [{
         "type": "forward",
         "value": ["your-email@gmail.com"]
       }],
       "enabled": true,
       "name": "Forward admin to destination"
     }'
```

### 4.5 noreply@advanciapayledger.com

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{
       "matchers": [{
         "type": "literal",
         "field": "to",
         "value": "noreply@advanciapayledger.com"
       }],
       "actions": [{
         "type": "forward",
         "value": ["your-email@gmail.com"]
       }],
       "enabled": true,
       "name": "Forward noreply to destination"
     }'
```

### 4.6 info@advanciapayledger.com

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json" \
     --data '{
       "matchers": [{
         "type": "literal",
         "field": "to",
         "value": "info@advanciapayledger.com"
       }],
       "actions": [{
         "type": "forward",
         "value": ["your-email@gmail.com"]
       }],
       "enabled": true,
       "name": "Forward info to destination"
     }'
```

---

## Step 5: Verify Setup

### List all routing rules:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/rules" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json"
```

### List destination addresses:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/zones/0bff66558872c58ed5b8b7942acc34d9/email/routing/addresses" \
     -H "Authorization: Bearer 5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-" \
     -H "Content-Type: application/json"
```

---

## ✅ Testing

Send test email to: `livechat@advanciapayledger.com`

Check your Gmail inbox - should arrive within seconds!

---

## 📝 Notes

- **Cost:** FREE (Cloudflare Free tier)
- **Limit:** 200 destination addresses per zone
- **Limit:** Unlimited forwarding rules
- **Deliverability:** Excellent (Cloudflare infrastructure)
- **Setup Time:** 5-10 minutes

---

## 🔧 Troubleshooting

**Email not arriving?**
1. Check spam folder
2. Verify destination email is verified (check email for link)
3. Check routing rules are enabled
4. Wait 5 minutes for DNS propagation

**API errors?**
1. Verify API token has correct permissions
2. Check Zone ID is correct
3. Ensure email routing is enabled first

---

## 🚀 Next Steps

1. ✅ Create all 6 email addresses
2. Update Tawk.to settings with `livechat@advanciapayledger.com`
3. Update backend email configuration
4. Test sending/receiving
5. Configure Gmail SMTP for sending (optional)

All emails forward to your Gmail for FREE! 🎉
