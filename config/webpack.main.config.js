const rules = require('./webpack.rules');
const { mainPlugins } = require('./webpack.plugins');

module.exports = {
  entry: './src/main.ts',
  module: { rules },
  plugins: mainPlugins,
  resolve: {
    extensions: ['.js', '.ts', '.json']
  }
};
