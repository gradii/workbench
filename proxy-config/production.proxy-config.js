module.exports = {
  '/api/proxy-s1/': {
    target: 'http://10.81.21.34:36521',
    pathRewrite: { '^/api/proxy-s1': '/api' }
  }
};
