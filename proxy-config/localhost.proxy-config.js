const PROXY_CONFIG = [
  {
    context: [
      "/api"
    ],
    'target': 'http://localhost:3333',
    'changeOrigin': true,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
