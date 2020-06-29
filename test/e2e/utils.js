const electron = require('electron');
const Application = require('spectron').Application;
const path = require('path');

module.exports = {
  createSpectronApp: () => {
    const app = path.join(__dirname, '..', '..', '.webpack', 'main');

    return new Application({
      path: electron,
      args: [app],
      env: {
        ELECTRON_ENABLE_LOGGING: true,
        ELECTRON_ENABLE_STACK_DUMPING: true
      },
      startTimeout: 20000,
      waitTimeout: 20000,
      chromeDriverLogPath: 'test/e2e-chromedriverlog.txt'
    });
  }
};
