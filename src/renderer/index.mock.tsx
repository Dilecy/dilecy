import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@yaireo/tagify/dist/tagify.css';
import { Provider } from 'react-redux';
import { DependencyInjector } from './core/dependencies';
import App from './App';
import { configureStore } from './store';
import { sealPassword, rng } from './core/crypto/password.mock';
import { createInMemoryClientBackend } from './model/mock/clientBackend';
// import { createServerBackend } from './model/serverBackend';
import { createMailerMock } from './core/mailer/mailerMock';
import { LoginSystem } from './feature/Login/login';
import { createTracker } from './core/tracker/tracker';
import { getMockBrowserHistory } from './core/browserHistory/mockBrowserHistory';
import { appStarted } from './core/actions';
import { createApiService } from './core/api/api-service';
import {
  getApiServerUrl,
  getTrackingServerUrl,
  TRACKING_SITE_ID
} from './shared/utils/environment';
import { createGoogleAuthMock } from './core/google/googleAuthMock';

const loginSystem = new LoginSystem();
// const apiService = createMockApiService();
const apiService = createApiService(getApiServerUrl());

const mailer = createMailerMock(100);
const trackingServer = getTrackingServerUrl();
const googleAuth = createGoogleAuthMock();

const tracker = createTracker(trackingServer, TRACKING_SITE_ID);

const browserHistory = (timeInMins: number) =>
  getMockBrowserHistory(timeInMins);

export const dependencies = {
  sealPassword,
  rng,
  loginSystem,
  clientBackend: createInMemoryClientBackend(),
  apiService,
  mailer,
  tracker,
  browserHistory,
  googleAuth
};

const store = configureStore(dependencies);
store.dispatch(appStarted({ version: '0.0.3', versionSuffix: '-MOCK' }));

const HotApp = hot(App);
if (!document.getElementById('root')) {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
}
ReactDOM.render(
  <DependencyInjector value={dependencies}>
    <Provider store={store}>
      <HotApp />
    </Provider>
  </DependencyInjector>,
  document.getElementById('root')
);
