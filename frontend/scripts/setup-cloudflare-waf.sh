#!/bin/bash
# Cloudflare WAF Setup Script for Advancia Pay Ledger
# This script automates the implementation of recommended security rules

set -e

echo "=========================================="
echo "Cloudflare WAF Security Setup"
echo "Advancia Pay Ledger"
echo "=========================================="

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install terraform
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip
        unzip terraform_1.7.0_linux_amd64.zip
        sudo mv terraform /usr/local/bin/
    fi
fi

# Get Cloudflare credentials
echo ""
echo "📝 Enter your Cloudflare credentials:"
read -p "Enter API Token: " API_TOKEN
read -p "Enter Zone ID: " ZONE_ID
read -p "Enter Domain (e.g., advancia.io): " DOMAIN

# Create terraform.tfvars
cat > terraform/terraform.tfvars <<EOF
cloudflare_api_token = "$API_TOKEN"
zone_id              = "$ZONE_ID"
domain               = "$DOMAIN"
EOF

echo ""
echo "⚙️  Initializing Terraform..."
cd terraform
terraform init

echo ""
echo "📋 Terraform Plan (showing what will be created):"
terraform plan

echo ""
read -p "Do you want to apply these changes? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Cancelled. No changes applied."
    exit 0
fi

echo ""
echo "🚀 Applying Cloudflare WAF configuration..."
terraform apply -auto-approve

echo ""
echo "✅ Cloudflare WAF Security Setup Complete!"
echo ""
echo "========== SUMMARY =========="
echo "✓ OWASP Core Rule Set: ENABLED"
echo "✓ Rate Limiting: CONFIGURED"
echo "  - API: 100 req/10sec"
echo "  - Login: 5 req/min"
echo "  - Payments: 50 req/min"
echo "✓ Firewall Rules: 5 custom rules"
echo "  - SQL Injection blocking"
echo "  - XSS protection"
echo "  - Authorization enforcement"
echo "  - AI bot blocking"
echo "  - Geo-restrictions"
echo "✓ Bot Management: ENABLED"
echo "✓ SSL/TLS: CONFIGURED (1.2+)"
echo "✓ Cache: OPTIMIZED"
echo ""
echo "🔗 View in Cloudflare Dashboard:"
echo "   https://dash.cloudflare.com/"
echo ""
echo "📊 Monitor at:"
echo "   Security → WAF → Security Events"
echo ""
