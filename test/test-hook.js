require('jsdom-global/register');

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    noImplicitAny: false
  }
});

const configure = require('enzyme').configure;
const Adapter = require('enzyme-adapter-react-16');
configure({ adapter: new Adapter() });

const noop = () => 1;

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.png'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;
require.extensions['.svg'] = noop;

APP_VERSION = JSON.stringify(process.env.npm_package_version);
