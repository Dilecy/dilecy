module.exports = {
  spec: './src/**/*.spec.[j|t]s{,x}',
  exit: true,
  timeout: 10000,
  require: 'test/test-hook.js',
  recursive: true,
  extension: ['ts', 'tsx', 'js', 'jsx']
};
