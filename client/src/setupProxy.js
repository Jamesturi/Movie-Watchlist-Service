// client/src/setupProxy.js
console.log('🛠 setupProxy.js loaded');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logLevel: 'debug',        // see proxy logs
    })
  );
};
