#!/usr/bin/env bash
set -euo pipefail

# Advancia PayLedger - VPS Demo Deploy (No DB)
# - Backend: Node + Express in-memory store (port 4000)
# - Frontend: Next.js (port 3000)
# - Process manager: PM2

APP_DIR="${APP_DIR:-/root/advanciapayledger-new}"
REPO_URL="${REPO_URL:-https://github.com/advancia-devuser/advancia-payledger-new.git}"
BRANCH="${BRANCH:-main}"

FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-4000}"

PUBLIC_HOST="${PUBLIC_HOST:-}"
JWT_SECRET="${JWT_SECRET:-change-me-for-demo}"
DEMO_SEED="${DEMO_SEED:-false}"
ADMIN_EMAILS="${ADMIN_EMAILS:-admin@advanciapayledger.com}"

log() { echo "[$(date +%H:%M:%S)] $*"; }

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

ensure_apt_basics() {
  log "Installing base packages"
  apt-get update -y
  apt-get install -y curl ca-certificates git build-essential
}

ensure_node_24() {
  if need_cmd node && node -v | grep -q '^v24\.'; then
    log "Node $(node -v) already installed"
    return
  fi

  log "Installing Node.js 24.x"
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
  log "Node $(node -v) installed"
}

ensure_pm2() {
  if need_cmd pm2; then
    log "PM2 already installed"
    return
  fi
  log "Installing PM2"
  npm i -g pm2
}

clone_or_update_repo() {
  if [[ -d "${APP_DIR}/.git" ]]; then
    log "Updating existing repo in ${APP_DIR}"
    cd "${APP_DIR}"
    git fetch origin --prune
    git switch "${BRANCH}" || git checkout -b "${BRANCH}" "origin/${BRANCH}"
    git pull --ff-only origin "${BRANCH}"
    return
  fi

  log "Cloning repo to ${APP_DIR}"
  rm -rf "${APP_DIR}"
  git clone -b "${BRANCH}" --depth 1 --single-branch "${REPO_URL}" "${APP_DIR}"
  cd "${APP_DIR}"
}

write_backend_env() {
  local cors
  if [[ -n "${PUBLIC_HOST}" ]]; then
    cors="http://${PUBLIC_HOST}:${FRONTEND_PORT}"
  else
    cors='*'
  fi

  log "Writing backend/.env"
  cat > backend/.env <<EOF
PORT=${BACKEND_PORT}
NODE_ENV=production
CORS_ORIGIN=${cors}
JWT_SECRET=${JWT_SECRET}
DEMO_SEED=${DEMO_SEED}
ADMIN_EMAILS=${ADMIN_EMAILS}
EOF
}

install_and_build() {
  log "Installing dependencies (root/backend/frontend)"
  npm run -s setup:demo

  log "Building backend"
  (cd backend && npm run -s build)

  log "Building frontend"
  (cd frontend && NEXT_PUBLIC_ADMIN_EMAILS="${ADMIN_EMAILS}" npm run -s build)
}

start_pm2() {
  log "Restarting PM2 processes"
  pm2 delete advancia-backend advancia-frontend >/dev/null 2>&1 || true

  pm2 start "npm --prefix ${APP_DIR}/backend start" --name advancia-backend
  BACKEND_URL="http://127.0.0.1:${BACKEND_PORT}" NEXT_PUBLIC_ADMIN_EMAILS="${ADMIN_EMAILS}" pm2 start "npm --prefix ${APP_DIR}/frontend start -- -p ${FRONTEND_PORT}" --name advancia-frontend

  pm2 save
  pm2 startup || true
}

verify_local() {
  log "Verifying backend health"
  curl -fsS "http://127.0.0.1:${BACKEND_PORT}/health" | head -c 200
  echo

  log "Verifying frontend local HTTP"
  curl -sSI "http://127.0.0.1:${FRONTEND_PORT}" | head -n 5
}

main() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "Run as root (or with sudo)." >&2
    exit 1
  fi

  ensure_apt_basics
  ensure_node_24
  ensure_pm2
  clone_or_update_repo
  write_backend_env
  install_and_build
  start_pm2
  verify_local

  echo
  log "Done"
  echo "Frontend: http://<YOUR_VPS_IP>:${FRONTEND_PORT}"
  echo "Backend:  http://<YOUR_VPS_IP>:${BACKEND_PORT}"
  echo
  echo "If the VPS URLs don't load in your browser but local curl works, open the firewall for port ${FRONTEND_PORT}."
}

main "$@"
