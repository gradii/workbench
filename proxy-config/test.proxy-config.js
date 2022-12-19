module.exports = {
  '/api/proxy-s1/': {
    "target": 'http://127.0.0.1:3002',
    secure: false,
    changeOrigin: true,
    pathRewrite: {'^/api/proxy-s1': '/api'},
    // "logLevel": "info",
  },
  '/api/proxy-s2/': {
    "target": 'http://127.0.0.1:3002',
    secure: false,
    changeOrigin: true,
    pathRewrite: {'^/api/proxy-s1': '/api'},
    // "logLevel": "info",
  },
  '/api': {
    "target": 'http://127.0.0.1:3001',
    secure: false,
    changeOrigin: true,
    // "logLevel": "debug"
  }
};
