const rules = require('./webpack.rules');
const { rendererPlugins } = require('./webpack.plugins');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
  },
  {
    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          publicPath: '..',
          context: 'src',
          name: '[path][name].[ext]'
        }
      }
    ]
  },
  {
    test: /\.svg$/,
    use: ['@svgr/webpack']
  }
);

module.exports = {
  module: {
    rules
  },
  plugins: rendererPlugins,
  devtool: 'inline-source-map',
  externals: {
    knex: 'commonjs knex',
    objection: 'commonjs objection',
    sqlite3: 'commonjs sqlite3',
    bcrypt: 'commonjs bcrypt',
    nodemailer: 'commonjs nodemailer'
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json'
      })
    ]
  }
};
