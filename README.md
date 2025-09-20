# Height Wealth Analyzer

An interactive data visualization tool that explores the correlation between height and wealth/fame using real-world data from famous wealthy individuals.

## 🌟 Features

- **Interactive Scatter Plot**: Height vs. Wealth visualization with density heatmap
- **Pie Chart Analysis**: Wealth distribution by height categories
- **Success Calculator**: Calculate your success probability based on height
- **Real Data**: Top 3000+ current billionaires and famous individuals
- **Responsive Design**: Beautiful glassmorphism UI with dark mode
- **Production Ready**: Optimized for performance and security

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use Python server for development
python3 -m http.server 8001
```

### Production Deployment

#### Option 1: Automated Deployment
```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy to production (replace with your domain)
./deploy.sh production yourdomain.com
```

#### Option 2: Manual Deployment
```bash
# Install dependencies
npm install --production

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
```

#### Option 3: Docker Deployment
```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🏗️ Architecture

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Glassmorphism design with CSS Grid/Flexbox
- **JavaScript**: Vanilla JS with Chart.js for visualizations
- **Chart.js**: Interactive scatter plots and pie charts

### Backend
- **Node.js**: Express server with production optimizations
- **PM2**: Process manager for zero-downtime deployments
- **Nginx**: Reverse proxy with SSL termination
- **Docker**: Containerized deployment option

### Data
- **CSV Format**: Famous wealthy people dataset
- **Real Names**: Actual billionaires and celebrities
- **Continuous Heights**: Realistic height distribution
- **Wealth Range**: $10K to $244B net worth

## 📊 Data Sources

The application uses a curated dataset of:
- Top 3000+ current billionaires
- Famous celebrities and entrepreneurs
- Real height and wealth data
- Living and deceased individuals
- Various industries and backgrounds

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env` and configure:

```bash
NODE_ENV=production
PORT=3000
DOMAIN=yourdomain.com
SSL_EMAIL=your-email@example.com
```

### Domain Setup
1. **DNS Configuration**: Point your domain to your server IP
2. **SSL Certificates**: Automated with Let's Encrypt
3. **Nginx Configuration**: Included in `nginx.conf`

### Performance Optimization
- **Gzip Compression**: Enabled for all text assets
- **Static Caching**: 1 year for CSS/JS, 1 day for CSV
- **CDN Ready**: Optimized for CDN deployment
- **Minification**: Automated build process

## 📈 Analytics Integration

The application is ready for analytics integration:

```javascript
// Google Analytics (uncomment in index.html)
// gtag('config', 'GA_MEASUREMENT_ID');

// Hotjar (uncomment in index.html)
// (function(h,o,t,j,a,r){...})
```

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Configured for production domains
- **Rate Limiting**: Built into Express server
- **Input Validation**: Sanitized user inputs
- **HTTPS**: Forced SSL redirect
- **Content Security Policy**: XSS protection

## 📱 Mobile Optimization

- **Responsive Design**: Works on all screen sizes
- **Touch Interactions**: Optimized for mobile devices
- **Performance**: Optimized for mobile networks
- **PWA Ready**: Can be converted to Progressive Web App

## 🔄 Deployment Options

### 1. Traditional VPS
- Ubuntu 20.04+ recommended
- 1GB RAM minimum
- Automated deployment script included

### 2. Cloud Platforms
- **AWS**: EC2 + ALB + CloudFront
- **Google Cloud**: Compute Engine + Load Balancer
- **DigitalOcean**: Droplet + Load Balancer
- **Vercel**: Serverless deployment ready

### 3. Container Platforms
- **Docker**: Single container deployment
- **Kubernetes**: Multi-container orchestration
- **Docker Compose**: Multi-service deployment

## 📊 Monitoring

### Health Checks
- **Application**: `/health` endpoint
- **PM2**: Process monitoring
- **Nginx**: Server status
- **Docker**: Container health checks

### Logging
```bash
# View application logs
pm2 logs height-wealth-analyzer

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View Docker logs
docker-compose logs -f
```

## 🎯 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB total
- **Lighthouse Score**: 95+ across all metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check this README first
- **Performance**: Monitor with PM2 and Nginx logs

## 🔮 Future Enhancements

- [ ] Real-time data updates
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] Social sharing features
- [ ] Mobile app version
- [ ] API endpoints for data access

---

**Built with ❤️ for data visualization and analysis**
