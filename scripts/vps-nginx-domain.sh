#!/usr/bin/env bash
set -euo pipefail

# Configure Nginx reverse proxy for Advancia demo (no DB)
# - /       -> Next.js (localhost:3000)
# - /api/*  -> Express (localhost:4000)

DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-}"

if [[ "${DOMAIN}" == "" ]]; then
  echo "Set DOMAIN first. Example:" >&2
  echo "  DOMAIN=app.yourdomain.com ./scripts/vps-nginx-domain.sh" >&2
  exit 1
fi

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root (or with sudo)." >&2
  exit 1
fi

apt-get update -y
apt-get install -y nginx

mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

SRC_CONF="$(pwd)/nginx/advancia.conf"
DEST_CONF="/etc/nginx/sites-available/advancia"

if [[ ! -f "${SRC_CONF}" ]]; then
  echo "Missing ${SRC_CONF}. Run this from the repo root (/root/advanciapayledger-new)." >&2
  exit 1
fi

sed "s/__DOMAIN__/${DOMAIN}/g" "${SRC_CONF}" > "${DEST_CONF}"

ln -sf "${DEST_CONF}" /etc/nginx/sites-enabled/advancia
rm -f /etc/nginx/sites-enabled/default || true

nginx -t
systemctl reload nginx

echo "Nginx configured for ${DOMAIN} (HTTP)."

# Optional SSL
if [[ "${EMAIL}" != "" ]]; then
  apt-get install -y certbot python3-certbot-nginx
  certbot --nginx -d "${DOMAIN}" -m "${EMAIL}" --agree-tos --non-interactive
  systemctl reload nginx
  echo "SSL enabled for ${DOMAIN}."
else
  echo "To enable SSL later:" 
  echo "  EMAIL=you@example.com DOMAIN=${DOMAIN} ./scripts/vps-nginx-domain.sh"
fi
