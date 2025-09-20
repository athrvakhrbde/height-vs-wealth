# 🚀 Production Deployment Guide

This guide will help you deploy the Height Wealth Analyzer to production with your domain.

## 📋 Prerequisites

- **VPS/Server**: Ubuntu 20.04+ with at least 1GB RAM
- **Domain**: Your domain name pointing to your server IP
- **SSH Access**: Root or sudo access to your server

## 🎯 Quick Deployment (Recommended)

### 1. Automated Deployment
```bash
# Clone your repository to your server
git clone https://github.com/yourusername/height-wealth-analyzer.git
cd height-wealth-analyzer

# Make deployment script executable
chmod +x deploy.sh

# Deploy to production (replace with your domain)
./deploy.sh production yourdomain.com
```

The automated script will:
- ✅ Install all dependencies (Node.js, PM2, Docker, Nginx)
- ✅ Configure SSL certificates with Let's Encrypt
- ✅ Set up Nginx reverse proxy
- ✅ Configure firewall
- ✅ Start all services
- ✅ Set up monitoring and auto-restart

## 🔧 Manual Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. Application Deployment
```bash
# Create app directory
sudo mkdir -p /var/www/height-wealth-analyzer
sudo chown -R $USER:$USER /var/www/height-wealth-analyzer

# Copy files
cp -r . /var/www/height-wealth-analyzer/
cd /var/www/height-wealth-analyzer

# Install dependencies
npm install --production

# Build application
npm run build

# Create logs directory
mkdir -p logs
```

### 3. SSL Configuration
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Setup auto-renewal
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
```

### 4. Nginx Configuration
```bash
# Update domain in nginx.conf
sed -i 's/yourdomain.com/yourdomain.com/g' nginx.conf

# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/height-wealth-analyzer
sudo ln -sf /etc/nginx/sites-available/height-wealth-analyzer /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Enable services
sudo systemctl enable nginx
```

## 🐳 Docker Deployment

### 1. Using Docker Compose
```bash
# Update domain in docker-compose.yml
sed -i 's/yourdomain.com/yourdomain.com/g' docker-compose.yml

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

### 2. Using Docker Only
```bash
# Build image
docker build -t height-wealth-analyzer .

# Run container
docker run -d \
  --name height-wealth-analyzer \
  -p 3000:3000 \
  -v $(pwd)/logs:/app/logs \
  height-wealth-analyzer
```

## 🌐 Domain Configuration

### 1. DNS Settings
Point your domain to your server IP:
```
A Record: yourdomain.com → YOUR_SERVER_IP
A Record: www.yourdomain.com → YOUR_SERVER_IP
```

### 2. Update Configuration Files
Replace `yourdomain.com` with your actual domain in:
- `nginx.conf`
- `docker-compose.yml`
- `env.example` → `.env`

### 3. SSL Certificate
If using automated deployment, SSL is handled automatically.
For manual setup:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application status
pm2 status
curl http://localhost:3000/health

# Check nginx status
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates
```

### Logs
```bash
# Application logs
pm2 logs height-wealth-analyzer

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Docker logs (if using Docker)
docker-compose logs -f
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
npm run build
pm2 restart height-wealth-analyzer

# Or with Docker
docker-compose down
docker-compose up -d --build
```

## 🔒 Security Checklist

- ✅ **Firewall**: Only ports 22, 80, 443 open
- ✅ **SSL**: HTTPS enforced with Let's Encrypt
- ✅ **Updates**: Regular system and package updates
- ✅ **Monitoring**: PM2 process monitoring
- ✅ **Logs**: Centralized logging setup
- ✅ **Backups**: Regular data backups

## 🚨 Troubleshooting

### Application Not Starting
```bash
# Check PM2 logs
pm2 logs height-wealth-analyzer

# Check if port is in use
sudo netstat -tulpn | grep :3000

# Restart application
pm2 restart height-wealth-analyzer
```

### SSL Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
curl -I https://yourdomain.com
```

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### Performance Issues
```bash
# Check server resources
htop
df -h
free -h

# Check PM2 monitoring
pm2 monit

# Optimize nginx (already configured)
```

## 📈 Performance Optimization

The application is already optimized for production:
- **Gzip Compression**: Enabled for all text assets
- **Static Caching**: 1 year for CSS/JS, 1 day for CSV
- **Minification**: CSS and JS are minified
- **CDN Ready**: Can be deployed to CDN
- **Health Checks**: Built-in monitoring

## 🔄 Backup Strategy

### Automated Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "/backups/height-wealth-analyzer_$DATE.tar.gz" /var/www/height-wealth-analyzer
find /backups -name "height-wealth-analyzer_*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab (daily backup)
(crontab -l 2>/dev/null; echo "0 2 * * * /path/to/backup.sh") | crontab -
```

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify all services are running
3. Test SSL certificate
4. Check DNS propagation
5. Review firewall settings

## 🎉 Success!

Once deployed, your application will be available at:
- **Main Site**: https://yourdomain.com
- **Health Check**: https://yourdomain.com/health
- **API Data**: https://yourdomain.com/api/data

The application includes:
- ✅ Interactive data visualizations
- ✅ Success probability calculator
- ✅ Real billionaire data
- ✅ Mobile-responsive design
- ✅ Production-ready performance
- ✅ Security best practices
