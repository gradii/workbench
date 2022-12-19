module.exports = {
  // '/api/proxy-s1/': {
  //   "target": 'http://127.0.0.1:3002',
  //   secure: false,
  //   changeOrigin: true,
  //   pathRewrite: {'^/api/proxy-s1': '/api'},
  //   // "logLevel": "info",
  // },
  // '/api/proxy-s2/': {
  //   "target": 'http://127.0.0.1:3002',
  //   secure: false,
  //   changeOrigin: true,
  //   pathRewrite: {'^/api/proxy-s2': '/api'},
  //   // "logLevel": "info",
  // },
  '/api': {
    "target": 'http://127.0.0.1:3333',
    secure: false,
    changeOrigin: true,
    "logLevel": "debug",
    "headers": {
      "X-Request-Id" : 'x-request-id_by_proxy_config_uuid'
    }
  },
  '/ws/gateway': {
    target: 'ws://127.0.0.1:3201',
    ws: true,
    secure: false,
    logLevel: 'debug',
    onError(err) {
      console.log('Suppressing WDS proxy upgrade error:', err);
    },
  },

};
