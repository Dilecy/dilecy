const DEV_API_URL = 'https://staging-backend.dilecy.de/api/v1';
const PROD_API_URL = 'https://backend.dilecy.de/api/v1';

const DEV_TRACKING_SERVER_URL = 'http://localhost:8001';
const PROD_TRACKING_SERVER_URL = 'https://tracking.dilecy.de';

const DEV_FORWARDER_URL = 'https://staging-forwarder.dilecy.de/api/v1';
const PROD_FORWARDER_URL = 'https://forwarder.dilecy.de/api/v1';

export const TESTING_EMAIL_TO = 'testing@dilecy.eu';
export const DILECY_WEBSITE = 'https://dilecy.eu/';
export const DILECY_OAUTH_REDIRECT = 'https://dilecy.eu/oauth-success/';

export const GOOGLE_CLIENT_ID =
  '222295287111-fna2a9okac3672fo1fb4t4h7s01s2djk.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = null;
export const GOOGLE_API_SCOPE = 'https://www.googleapis.com/auth/gmail.send';
export const GOOGLE_PROFILE_URL =
  'https://www.googleapis.com/oauth2/v2/userinfo';

export const SNOOZE_DAYS = 30;
export const SNOOZE_LIMIT = 1;
export const DUE_DAY_DURATION = 30;
export const PROGRESS_COMPLETED = 100;

export enum Environment {
  STAGING,
  PROD
}

export const getEnvironment = (): Environment => {
  if (process.env.NODE_ENV === 'development') {
    return Environment.STAGING;
  } else {
    return Environment.PROD;
  }
};

export const isDevelopment = (): boolean =>
  process.env.NODE_ENV === 'development';

export const getApiServerUrl = (): string =>
  isDevelopment() ? DEV_API_URL : PROD_API_URL;

export const getTrackingServerUrl = (): string =>
  isDevelopment() ? DEV_TRACKING_SERVER_URL : PROD_TRACKING_SERVER_URL;

export const getForwarderServerUrl = (): string =>
  isDevelopment() ? DEV_FORWARDER_URL : PROD_FORWARDER_URL;

export const HISTORY_IMPORT_LIMIT = 10000;

export const TRACKING_SITE_ID = 2;
