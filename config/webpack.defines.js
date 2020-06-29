const assert = require('assert');
const DefinePlugin = require('webpack').DefinePlugin;

// We set BUILD_ENV in npm scripts (package.json)
const enableMainWindowsNodeIntegration = JSON.stringify(
  true // Needed for SQLite
  // process.env.BUILD_ENV === 'e2etest' || process.env.BUILD_ENV === 'development'
);

const isDevelopmentBuild = JSON.stringify(
  process.env.BUILD_ENV === 'development'
);

assert(
  process.env.npm_package_version !== undefined,
  'Version info missing in package.json'
);
const appVersion = JSON.stringify(process.env.npm_package_version);

module.exports = {
  mainDefinePlugin: new DefinePlugin({
    MAIN_WINDOW_ENABLE_NODE_INTEGRATION: enableMainWindowsNodeIntegration,
    IS_DEVELOPMENT: isDevelopmentBuild
  }),
  rendererDefinePlugin: new DefinePlugin({
    APP_VERSION: appVersion
  })
};
