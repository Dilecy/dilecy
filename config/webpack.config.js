module.exports = {
  port: 8080,
  mainConfig: require('./webpack.main.config.js'),
  renderer: {
    config: require('./webpack.renderer.config.js'),
    entryPoints: [
      {
        html: './src/renderer/index.html',
        js: './src/renderer/index.tsx',
        name: 'main_window'
      }
    ]
  }
};
