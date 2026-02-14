# Terraform configuration for Cloudflare WAF Security Rules
# Implements all recommended security measures for Advancia Pay Ledger

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  sensitive   = true
}

variable "zone_id" {
  description = "Cloudflare Zone ID"
}

variable "domain" {
  description = "Domain name"
  default     = "advancia.io"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# ===== 1. OWASP Core Rule Set =====
resource "cloudflare_waf_rule" "owasp_sqli" {
  zone_id  = var.zone_id
  rule_id  = "100000"
  group_id = "de677dc5f881cvf0"
  mode     = "block"
}

resource "cloudflare_waf_rule" "owasp_xss" {
  zone_id  = var.zone_id
  rule_id  = "100001"
  group_id = "62d9f6cd4d1c5d34"
  mode     = "block"
}

# ===== 2. Rate Limiting Rules =====

# API Endpoints - 100 requests per 10 seconds
resource "cloudflare_rate_limit" "api_general" {
  zone_id      = var.zone_id
  disabled     = false
  description  = "Rate limit general API calls"
  match {
    request {
      url {
        path {
          matches = "^/api/.*"
        }
      }
    }
  }
  threshold = 100
  period    = 10
  action {
    mode    = "challenge"
    timeout = 300
  }
}

# Login endpoint - 5 requests per minute
resource "cloudflare_rate_limit" "auth_login" {
  zone_id      = var.zone_id
  disabled     = false
  description  = "Rate limit login attempts"
  match {
    request {
      url {
        path {
          matches = "^/auth/login.*"
        }
      }
      method {
        matches = "POST"
      }
    }
  }
  threshold = 5
  period    = 60
  action {
    mode    = "challenge"
    timeout = 900
  }
}

# Payments endpoint - 50 requests per minute
resource "cloudflare_rate_limit" "api_payments" {
  zone_id      = var.zone_id
  disabled     = false
  description  = "Rate limit payment API calls"
  match {
    request {
      url {
        path {
          matches = "^/api/payments/.*"
        }
      }
    }
  }
  threshold = 50
  period    = 60
  action {
    mode    = "block"
    timeout = 300
  }
}

# ===== 3. Firewall Rules (Custom Rules) =====

# Block SQL Injection patterns
resource "cloudflare_firewall_rule" "block_sqli" {
  zone_id     = var.zone_id
  description = "Block SQL Injection attempts"
  filter_id   = cloudflare_firewall_filter.sqli_filter.id
  action      = "block"
}

resource "cloudflare_firewall_filter" "sqli_filter" {
  zone_id     = var.zone_id
  description = "SQL Injection patterns"
  expression  = "(cf.threat_score > 50) or (http.request.uri.query contains \" OR \") or (http.request.uri.query contains \"' OR '1'='1\") or (http.request.body contains \"UNION SELECT\")"
}

# Block XSS attempts
resource "cloudflare_firewall_rule" "block_xss" {
  zone_id     = var.zone_id
  description = "Block XSS attempts"
  filter_id   = cloudflare_firewall_filter.xss_filter.id
  action      = "block"
}

resource "cloudflare_firewall_filter" "xss_filter" {
  zone_id     = var.zone_id
  description = "XSS patterns"
  expression  = "(http.request.uri.query contains \"<script\") or (http.request.uri.query contains \"javascript:\") or (http.request.body contains \"<img src=x onerror=\")"
}

# Require authorization header on API endpoints
resource "cloudflare_firewall_rule" "require_api_auth" {
  zone_id     = var.zone_id
  description = "Block API calls without Authorization header"
  filter_id   = cloudflare_firewall_filter.no_auth_filter.id
  action      = "block"
}

resource "cloudflare_firewall_filter" "no_auth_filter" {
  zone_id     = var.zone_id
  description = "Requests to /api/* without Authorization"
  expression  = "(http.request.uri.path matches \"^/api/\") and not (http.request.headers[\"authorization\"] exists)"
}

# Block AI/Scraper bots
resource "cloudflare_firewall_rule" "block_ai_bots" {
  zone_id     = var.zone_id
  description = "Block AI crawlers (ChatGPT, Claude)"
  filter_id   = cloudflare_firewall_filter.ai_bot_filter.id
  action      = "block"
}

resource "cloudflare_firewall_filter" "ai_bot_filter" {
  zone_id     = var.zone_id
  description = "AI crawler detection"
  expression  = "(http.user_agent contains \"GPTBot\") or (http.user_agent contains \"Claude-Web\") or (http.user_agent contains \"ChatGPT\") or (cf.bot_management.score < 30)"
}

# ===== 4. Page Rules (Security Headers) =====

resource "cloudflare_page_rule" "security_headers" {
  zone_id = var.zone_id
  target  = "${var.domain}/*"
  priority = 1
  actions {
    security_header {
      enabled            = true
      include_subdomains = true
      max_age            = 31536000
      preload            = true
      nosniff            = true
    }
    security_level = "high"
  }
}

# ===== 5. Bot Management Settings =====

resource "cloudflare_bots_settings" "api_bots" {
  zone_id        = var.zone_id
  bot_fight_mode = {
    enabled = true
  }
  super_bot_fight_mode = {
    enabled = true
    definitely_automated = {
      action = "block"
    }
    likely_automated = {
      action = "challenge"
    }
    verified_bots = {
      action = "allow"
    }
  }
}

# ===== 6. DDoS Settings =====

resource "cloudflare_page_rule" "ddos_protection" {
  zone_id = var.zone_id
  target  = "${var.domain}/*"
  priority = 2
  actions {
    security_level = "high"
    cache_level    = "cache_everything"
  }
}

# ===== 7. SSL/TLS Settings =====

resource "cloudflare_zone_settings_override" "ssl_tls" {
  zone_id = var.zone_id

  settings {
    ssl                      = "full"
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    universal_ssl            = "on"
    always_use_https         = "on"
  }
}

# ===== 8. Firewall Rules for Geo-Restrictions =====

resource "cloudflare_firewall_rule" "block_high_risk_countries" {
  zone_id     = var.zone_id
  description = "Challenge requests from high-risk countries"
  filter_id   = cloudflare_firewall_filter.country_filter.id
  action      = "challenge"
}

resource "cloudflare_firewall_filter" "country_filter" {
  zone_id     = var.zone_id
  description = "High-risk countries"
  expression  = "(cf.country in {\"KP\" \"IR\" \"SY\"})"
}

# ===== 9. Cache Settings =====

resource "cloudflare_page_rule" "cache_assets" {
  zone_id = var.zone_id
  target  = "${var.domain}/assets/*"
  priority = 3
  actions {
    cache_level         = "cache_everything"
    browser_cache_ttl   = 31536000
    edge_cache_ttl      = 31536000
    cache_on_cookie     = "session_id"
  }
}

# ===== 10. Outputs =====

output "security_status" {
  value = {
    owasp_enabled   = true
    rate_limit_enabled = true
    firewall_rules  = 5
    bot_management  = "enabled"
    ssl_tls         = "configured"
  }
}
