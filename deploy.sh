#!/bin/bash

# Production Deployment Script for Height Wealth Analyzer
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
DOMAIN=${2:-yourdomain.com}

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install -y nginx
fi

# Create application directory
APP_DIR="/var/www/height-wealth-analyzer"
print_status "Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Copy application files
print_status "Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

# Install dependencies
print_status "Installing dependencies..."
npm install --production

# Build application
print_status "Building application..."
npm run build

# Create logs directory
sudo mkdir -p logs
sudo chown -R $USER:$USER logs

# Setup SSL certificates (Let's Encrypt)
if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Setting up SSL certificates..."
    
    # Install Certbot if not present
    if ! command -v certbot &> /dev/null; then
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Generate SSL certificate
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Setup auto-renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
fi

# Update Nginx configuration
print_status "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/height-wealth-analyzer
sudo ln -sf /etc/nginx/sites-available/height-wealth-analyzer /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start services
print_status "Starting services..."

# Start with PM2
pm2 start ecosystem.config.js --env $ENVIRONMENT

# Save PM2 configuration
pm2 save
pm2 startup

# Start Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create systemd service for PM2
print_status "Creating systemd service..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Health check
print_status "Performing health check..."
sleep 5

if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application health check failed"
    exit 1
fi

# Show status
print_status "Deployment completed successfully!"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "🌐 Access your application at:"
echo "   - Local: http://localhost:3000"
echo "   - Domain: https://$DOMAIN"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: pm2 logs height-wealth-analyzer"
echo "   - Restart: pm2 restart height-wealth-analyzer"
echo "   - Stop: pm2 stop height-wealth-analyzer"
echo "   - Monitor: pm2 monit"
echo ""
print_status "🎉 Deployment completed successfully!"
