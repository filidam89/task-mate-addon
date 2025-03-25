
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 8099;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy API requests to Home Assistant
app.use('/api/hassio', createProxyMiddleware({
  target: 'http://supervisor/core',
  changeOrigin: true,
  pathRewrite: {
    '^/api/hassio': '/api'
  },
  headers: {
    'Authorization': `Bearer ${process.env.SUPERVISOR_TOKEN}`
  }
}));

// Handle routes in the SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`TaskMate addon server running on port ${port}`);
});
