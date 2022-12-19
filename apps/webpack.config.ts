const webpack = require('webpack');

module.exports = (config, context) => {
  // Install additional plugins
  console.log('loading plugins')

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      'openapi': '@nestjs/swagger',
    })
  ]

  const rule = config.module.rules.find(it => it.loader.includes('ts-loader'));
  if (!rule) throw new Error('no ts-loader rule found');
  rule.options.getCustomTransformers = program => ({
    before: [
      require('@nestjs/swagger/plugin').before(
        {
          dtoFileNameSuffix: ['.dto.ts', '.ro.ts', '.entity.ts']
        },
        program
      )
    ]
  });
  return config;
};
