import { remote, ipcRenderer } from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { DependencyInjector } from './core/dependencies';
import { ThemeRoot } from './shared/styles/theme';
import { appVersion } from './core/appInfo';
import { configureStore } from './store';
import { sealPassword, rng } from './core/crypto/password';
import { LoginSystem } from './feature/Login/login';
import { DBClientBackend } from './model/db/clientBackend';
import { createMailer } from './core/mailer/mailer';
import { createTracker } from './core/tracker/tracker';
import { getBrowserHistoryAsync } from './core/browserHistory/browserHistory';
import { appStarted, requestLogout } from './core/actions';
import { createApiService } from './core/api/api-service';
import { googleAuth } from './core/google/googleAuth';
import {
  getApiServerUrl,
  getTrackingServerUrl,
  TRACKING_SITE_ID
} from './shared/utils/environment';

// import { createServerBackendMock } from './model/mock/serverBackend';
// import { createMailerMock } from './mailer/mailerMock';
// const serverBackend = createServerBackendMock();
const apiService = createApiService(getApiServerUrl());

const userData = remote.app.getPath('userData');
const clientBackend = new DBClientBackend(userData);

// const mailer = createMailerMock(1000);
const mailer = createMailer();

const trackingServer = getTrackingServerUrl();

const tracker = createTracker(trackingServer, TRACKING_SITE_ID);
// const tracker = createTrackerMock();

const browserHistory = (timeInMins: number) =>
  getBrowserHistoryAsync(timeInMins);

const dependencies = {
  sealPassword,
  rng,
  loginSystem: new LoginSystem(),
  clientBackend,
  apiService,
  mailer,
  tracker,
  browserHistory,
  googleAuth
};

const store = configureStore(dependencies);
store.dispatch(appStarted({ version: appVersion }));

ipcRenderer.on('app-close', () => {
  store.dispatch(requestLogout());
  setTimeout(() => ipcRenderer.send('quit-app'), 500);
});

ReactDOM.render(
  <DependencyInjector value={dependencies}>
    <Provider store={store}>
      <ThemeRoot />
    </Provider>
  </DependencyInjector>,
  document.getElementById('root')
);
