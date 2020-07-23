module.exports = {
  spec: './test/**/*.spec.[j|t]s',
  exit: true,
  require: 'ts-node/register',
  recursive: true,
  timeout: 20000,
  extension: ['js', 'ts']
};
