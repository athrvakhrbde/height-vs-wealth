const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : true
}));

// Compression middleware
app.use(compression());

// Static file serving
app.use(express.static(path.join(__dirname), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true
}));

// Cache control for different file types
app.use('/styles.css', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=31536000');
  next();
});

app.use('/script.js', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=31536000');
  next();
});

app.use('/famous_wealthy_people.csv', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=86400'); // 1 day for data
  next();
});

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API endpoint for data (optional)
app.get('/api/data', (req, res) => {
  res.sendFile(path.join(__dirname, 'famous_wealthy_people.csv'), {
    headers: {
      'Content-Type': 'text/csv',
      'Cache-Control': 'public, max-age=86400'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Height Wealth Analyzer running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
