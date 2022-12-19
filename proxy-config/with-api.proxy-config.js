module.exports = {
  '/api/proxy-s1/': {
    "target": 'http://127.0.0.1:3001',
    secure: false,
    changeOrigin: true,
    // "logLevel": "info",
  },
  '/api/proxy-s2/': {
    "target": 'http://127.0.0.1:3001',
    secure: false,
    changeOrigin: true,
    // "logLevel": "info",
  },
  '/api': {
    "target": 'http://127.0.0.1:3001',
    secure: false,
    changeOrigin: true,
    // "logLevel": "debug"
  }
};
