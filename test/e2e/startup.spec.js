const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const app = require('./utils').createSpectronApp();

chai.should();
chai.use(chaiAsPromised);

describe('Application Startup', function() {
  before(function() {
    chaiAsPromised.transferPromiseness = app.transferPromiseness;
    return app.start();
  });

  after(function() {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  describe('Electron app', function() {
    // wait for Electron window to open
    it('should open exactly one window', function() {
      return app.client
        .waitUntilWindowLoaded()
        .getWindowCount()
        .should.eventually.equal(1);
    });
  });

  describe('Main window', function() {
    it('should be visible', function() {
      return app.browserWindow.isVisible().should.eventually.be.true;
    });
  });
});
