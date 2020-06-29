const path = require('path');
const WebpackPlugin = require('@electron-forge/plugin-webpack').default;

const webpackPlugin = new WebpackPlugin(require('../config/webpack.config'));

// Initialize webpack plugin with project folder
webpackPlugin.init(path.join(__dirname, '..'));

// Fetch and execute prePackage hook. This will trigger a webpack production
// bundle build.
const createProductionBundle = webpackPlugin.getHook('prePackage');

createProductionBundle().catch(err => {
  console.error(err);
});
