#!/usr/bin/env bash
set -euo pipefail

FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-4000}"

echo "== PM2 =="
pm2 status || true

echo
echo "== Backend health =="
curl -fsS "http://127.0.0.1:${BACKEND_PORT}/health" | head -c 500
echo

echo
echo "== Frontend headers =="
curl -sSI "http://127.0.0.1:${FRONTEND_PORT}" | head -n 20
