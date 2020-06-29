const { mainDefinePlugin, rendererDefinePlugin } = require('./webpack.defines');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const copyMain = new CopyWebpackPlugin([
  { from: 'resources', to: 'resources' }
]);

module.exports = {
  mainPlugins: [mainDefinePlugin, copyMain],
  rendererPlugins: [rendererDefinePlugin]
};
