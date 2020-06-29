const webpackConfig = require('./webpack.config');
const path = require('path');
const rimraf = require('rimraf');

const appIconIco = path.join(__dirname, '..', 'resources', 'app_icon.ico');
const isProduction = process.env.BUILD_ENV !== 'development';

const makePackagerConfig = () => {
  const config = {
    icon: path.join('resources', 'app_icon'),
    prune: true,
    osxSign: {
      hardenedRuntime: true,
      entitlements: 'config/entitlements-minimal.plist',
      'entitlements-inherit': 'config/entitlements-minimal.plist'
    },
    asar: {
      // unpack those node native binaries so that the notarization can examine these libraries.
      unpack: '*.node'
    },
    appBundleId: 'com.dilecy.desktop',
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      // use the following command to store the password, replace <APPLE_ID> and <APP_SPECIFIC_PASSWORD>
      // security add-generic-password -a "<APPLE_ID>" -w <APP_SPECIFIC_PASSWORD> -s "AC_PASSWORD"
      appleIdPassword: '@keychain:AC_PASSWORD'
    }
  };

  // This custom ignore is required for production builds (packages), but makes dev builds
  // super slow.
  if (isProduction) {
    config.ignore = file => {
      if (!file) return false;
      if (/^[/\\]\.webpack($|[/\\]).*$/.test(file)) return false;
      return !/^[/\\]node_modules($|[/\\][^.]).*$/.test(file);
    };
  }

  return config;
};

module.exports = {
  packagerConfig: makePackagerConfig(),
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'dilecy_desktop',
        loadingGif: path.join(__dirname, 'splash.gif'),
        iconUrl: appIconIco,
        setupIcon: appIconIco
      }
    },
    {
      name: '@electron-forge/maker-pkg',
      platforms: ['darwin']
    }
  ],
  plugins: [['@electron-forge/plugin-webpack', webpackConfig]],
  hooks: {
    prePackage: () => {
      const cb = err => {
        if (err) console.error(err);
      };
      rimraf('node_modules/sqlite3/build', cb);
      rimraf('node_modules/sqlite3/lib/binding/node-*', cb);
    }
  }
};
