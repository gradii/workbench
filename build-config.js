/**
 * Build configuration for the packaging tool. This file will be automatically detected and used
 * to build the different packages inside of Material.
 */
const {join} = require('path');

const packageJson = require('./package.json');

/** Current version of the project*/
const buildVersion = packageJson.version;

module.exports = {
  projectVersion: buildVersion,
  projectDir: __dirname,
  packagesDir: join(__dirname, 'src'),
  outputDir: join(__dirname, 'dist'),
};
