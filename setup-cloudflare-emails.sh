#!/bin/bash

# Cloudflare Email Routing Setup Script
# Domain: advanciapayledger.com
# Zone ID: 0bff66558872c58ed5b8b7942acc34d9

DESTINATION_EMAIL="YOUR_EMAIL@gmail.com"  # ⚠️ CHANGE THIS TO YOUR REAL EMAIL!

ZONE_ID="0bff66558872c58ed5b8b7942acc34d9"
API_TOKEN="5tovG0IhoVoeZ2y-fNaEyFkmTBahLJUiIvlhihQ-"
DOMAIN="advanciapayledger.com"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Cloudflare Email Routing Setup - Advancia Pay Ledger   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$DESTINATION_EMAIL" = "YOUR_EMAIL@gmail.com" ]; then
    echo -e "${RED}[ERROR] Please edit line 7 and set your real email address!${NC}"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} Verifying Cloudflare API token..."
VERIFY=$(curl -s -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json")

if echo "$VERIFY" | grep -q '"success":true'; then
    echo -e "${GREEN}[SUCCESS]${NC} API token verified successfully"
else
    echo -e "${RED}[ERROR]${NC} API token verification failed"
    echo "$VERIFY"
    exit 1
fi

echo ""
echo -e "${BLUE}[INFO]${NC} Enabling email routing for zone..."
ENABLE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/enable" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json")

if echo "$ENABLE" | grep -q '"success":true'; then
    echo -e "${GREEN}[SUCCESS]${NC} Email routing enabled"
elif echo "$ENABLE" | grep -q "already enabled"; then
    echo -e "${YELLOW}[INFO]${NC} Email routing already enabled"
else
    echo -e "${YELLOW}[WARNING]${NC} Email routing response: $ENABLE"
fi

echo ""
echo -e "${BLUE}[INFO]${NC} Creating destination address: $DESTINATION_EMAIL"
DESTINATION=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/addresses" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json" \
     --data "{\"email\":\"$DESTINATION_EMAIL\"}")

if echo "$DESTINATION" | grep -q '"success":true'; then
    echo -e "${GREEN}[SUCCESS]${NC} Destination address created"
    echo -e "${YELLOW}[WARNING]${NC} Check your email for verification link!"
elif echo "$DESTINATION" | grep -q "already exists"; then
    echo -e "${YELLOW}[INFO]${NC} Destination address already exists"
else
    echo -e "${RED}[ERROR]${NC} Failed to create destination: $DESTINATION"
fi

echo ""
echo -e "${YELLOW}Press Enter after you've verified your email...${NC}"
read

echo ""
echo -e "${BLUE}[INFO]${NC} Creating email forwarding rules..."

EMAILS=(
    "livechat"
    "support"
    "billing"
    "admin"
    "noreply"
    "info"
)

for EMAIL in "${EMAILS[@]}"; do
    RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" \
         -H "Authorization: Bearer $API_TOKEN" \
         -H "Content-Type: application/json" \
         --data "{
           \"matchers\": [{
             \"type\": \"literal\",
             \"field\": \"to\",
             \"value\": \"$EMAIL@$DOMAIN\"
           }],
           \"actions\": [{
             \"type\": \"forward\",
             \"value\": [\"$DESTINATION_EMAIL\"]
           }],
           \"enabled\": true,
           \"name\": \"Forward $EMAIL to destination\"
         }")
    
    if echo "$RESULT" | grep -q '"success":true'; then
        echo -e "${GREEN}[SUCCESS]${NC} ✓ Created: $EMAIL@$DOMAIN"
    else
        echo -e "${RED}[ERROR]${NC} ✗ Failed: $EMAIL@$DOMAIN"
        echo "$RESULT"
    fi
done

echo ""
echo -e "${BLUE}[INFO]${NC} Fetching all email routing rules..."
RULES=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json")

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    Setup Complete! 🎉                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Active Email Addresses:${NC}"
echo "$RULES" | grep -o '"to","value":"[^"]*"' | sed 's/"to","value":"//g' | sed 's/"//g' | while read email; do
    echo -e "  ${GREEN}✓${NC} $email → $DESTINATION_EMAIL"
done

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Test by sending email to: livechat@$DOMAIN"
echo "  2. Update Tawk.to with: livechat@$DOMAIN"
echo "  3. Update backend email config"
echo ""
echo -e "${GREEN}All emails will forward to: $DESTINATION_EMAIL${NC}"
