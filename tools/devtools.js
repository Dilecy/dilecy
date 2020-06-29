const { app, BrowserWindow } = require('electron');
const path = require('path');
const {
  default: install,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer');
const devtron = require('devtron');

const appName =
  process.env.npm_package_productName || process.env.npm_package_name;

if (appName === undefined) {
  console.error(
    'You need to specify either name or productName in package.json'
  );
  app.quit();
}
app.setName(appName);
app._setDefaultAppPaths(path.resolve(__dirname, '..'));

async function installDevTools() {
  try {
    console.log(
      `Installed DevTools Extension: ${await install(REACT_DEVELOPER_TOOLS)}`
    );
    console.log(
      `Installed DevTools Extension: ${await install(REDUX_DEVTOOLS)}`
    );
    console.log(
      `Installing Devtron: ${devtron.install() ? 'succeeded' : 'failed'}`
    );
  } catch (err) {
    console.error(`Error during install: ${err}`);
  }
}

async function removeDevTools() {
  const extensions = BrowserWindow.getDevToolsExtensions();
  for (const ext in extensions) {
    BrowserWindow.removeDevToolsExtension(ext);
    console.log(`Removed DevTools Extension: ${ext}`);
  }
}

app.on('ready', async function() {
  console.log(`Electron app: ${app.getName()}`);
  const args = process.argv.slice(2);
  if (args.length < 1) {
    args.push('--install');
    console.log('devtools.js: No arguments specified, assuming --install.');
  }
  for (const arg of args) {
    if (arg.match(/--list/)) {
      console.log(BrowserWindow.getDevToolsExtensions());
    } else if (arg.match(/--install/)) {
      await installDevTools();
    } else if (arg.match(/--remove/)) {
      await removeDevTools();
    }
  }
  app.quit();
});
