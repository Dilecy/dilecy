/* eslint-disable @typescript-eslint/camelcase */
const path = require('path');
const fs = require('fs-extra');

const isWindows = process.platform === 'win32';
const isMacos = process.platform === 'darwin';
const linuxLibs = ['<(sqlcipher)/libsqlcipher.a', '<(sqlcipher)/libcrypto.a'];
const macosLibs = ['<(sqlcipher)/libsqlcipher.a'];
const windowsLibs = [
  'libsqlite3.lib',
  'libcrypto64MT.lib',
  'libssl64MT.lib',
  'ws2_32.lib',
  'shell32.lib',
  'advapi32.lib',
  'gdi32.lib',
  'user32.lib',
  'crypt32.lib'
];
const libs = isWindows ? windowsLibs : (isMacos ? macosLibs : linuxLibs);

const bindingGyp = {
  includes: ['deps/common-sqlite.gypi'],
  variables: {
    sqlcipher: path.resolve(__dirname, 'sqlcipher')
  },
  targets: [
    {
      target_name: '<(module_name)',
      include_dirs: ['<!(node -e "require(\'nan\')")', '<(sqlcipher)/include'],
      libraries: libs,
      msvs_settings: {
        VCLinkerTool: {
          AdditionalLibraryDirectories: ['<(sqlcipher)']
        }
      },
      sources: [
        'src/backup.cc',
        'src/database.cc',
        'src/node_sqlite3.cc',
        'src/statement.cc'
      ]
    },
    {
      target_name: 'action_after_build',
      type: 'none',
      dependencies: ['<(module_name)'],
      copies: [
        {
          files: ['<(PRODUCT_DIR)/<(module_name).node'],
          destination: '<(module_path)'
        }
      ]
    }
  ]
};

fs.writeJSONSync(
  path.resolve(__dirname, '../node_modules/sqlite3/binding.gyp'),
  bindingGyp,
  { spaces: 2 }
);
