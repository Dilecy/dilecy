module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader'
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
        enableDebugLog: true
      }
    }
  },
  // Add support for typescript
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|.webpack)/,
    loaders: [{ loader: 'ts-loader', options: { transpileOnly: true } }]
  }
];
