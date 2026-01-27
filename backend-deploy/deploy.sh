#!/bin/bash

# Advancia PayLedger Backend Deployment Script
# Production-ready deployment automation

set -e

echo "🚀 ADVANCIA PAYLEDGER BACKEND DEPLOYMENT"
echo "========================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# System Update
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    usermod -aG docker $USER
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose already installed"
fi

# Install additional tools
echo "🛠️ Installing additional tools..."
apt install -y curl wget git htop nano ufw certbot python3-certbot-nginx

# Setup Firewall
echo "🔒 Setting up firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# Create Advancia directory
echo "📁 Creating Advancia directory..."
mkdir -p /opt/advancia
cd /opt/advancia

# Create environment file template
echo "⚙️ Creating environment configuration..."
cat > .env << EOF
# Database Configuration
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)

# Security
JWT_SECRET=$(openssl rand -base64 64)
API_KEYS=$(openssl rand -base64 32)

# Blockchain Configuration
BLOCKCHAIN_ENDPOINTS="https://mainnet.infura.io/v3/YOUR_PROJECT_ID,https://polygon-rpc.com,https://bsc-dataseed.binance.org"

# Monitoring
GRAFANA_PASSWORD=$(openssl rand -base64 16)

# Application Settings
NODE_ENV=production
PORT=3000
DOMAIN=your-domain.com
SSL_EMAIL=admin@your-domain.com
EOF

# Set permissions
chmod 600 .env
chown root:root .env

# Create SSL directory
mkdir -p ssl logs nginx grafana/dashboards grafana/datasources

# Create Nginx configuration
echo "🌐 Creating Nginx configuration..."
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3000;
    }

    server {
        listen 80;
        server_name _;
        
        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name _;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # Backend proxy
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            proxy_pass http://backend/health;
            access_log off;
        }
    }
}
EOF

# Create Prometheus configuration
echo "📊 Creating Prometheus configuration..."
cat > prometheus.yml << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'advancia-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s
EOF

# Create backup script
echo "💾 Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash

# Advancia PayLedger Backup Script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec advancia_postgres pg_dump -U advancia_user advancia_payledger > $BACKUP_DIR/postgres_$DATE.sql

# Backup Redis
docker exec advancia_redis redis-cli --rdb $BACKUP_DIR/redis_$DATE.rdb

# Backup application data
tar -czf $BACKUP_DIR/app_data_$DATE.tar.gz /opt/advancia/logs /opt/advancia/uploads

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh

# Create monitoring script
echo "📈 Creating monitoring script..."
cat > monitor.sh << 'EOF'
#!/bin/bash

echo "🚀 Advancia PayLedger System Status"
echo "=================================="

# Docker status
echo "📦 Docker Services:"
docker-compose ps

echo ""
echo "💾 Disk Usage:"
df -h

echo ""
echo "🐳 Docker Disk Usage:"
docker system df

echo ""
echo "📊 Resource Usage:"
docker stats --no-stream

echo ""
echo "🔍 Service Health:"
curl -s http://localhost:3000/health || echo "❌ Backend health check failed"
EOF

chmod +x monitor.sh

# Setup automatic backups
echo "⏰ Setting up automatic backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/advancia/backup.sh") | crontab -

# Setup SSL certificate (Let's Encrypt)
echo "🔐 Setting up SSL certificate..."
echo "NOTE: Update DOMAIN and SSL_EMAIL in .env file before running:"
echo "certbot --nginx -d \$DOMAIN --email \$SSL_EMAIL --agree-tos --non-interactive"

echo ""
echo "✅ Deployment setup complete!"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Edit /opt/advancia/.env with your domain and settings"
echo "2. Copy your backend code to /opt/advancia/"
echo "3. Run: docker-compose up -d"
echo "4. Check status: docker-compose ps"
echo "5. Monitor: ./monitor.sh"
echo ""
echo "🔗 Access URLs:"
echo "- Backend API: http://localhost:3000"
echo "- Grafana: http://localhost:3001"
echo "- Prometheus: http://localhost:9090"
echo ""
echo "📁 Important files:"
echo "- Configuration: /opt/advancia/.env"
echo "- Logs: /opt/advancia/logs/"
echo "- Backups: /opt/backups/"
echo "- Monitor: ./monitor.sh"
echo "- Backup: ./backup.sh"
