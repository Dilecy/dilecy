// Defined by webpack cp. config/webpack.defines.js
declare let APP_VERSION: string;
const getAppVersion = () => {
  let appVersion = '';
  try {
    appVersion = APP_VERSION;
  } catch (e) {
    console.error(e);
    appVersion = '#.#.#';
  }
  return appVersion;
};
export const appVersion = getAppVersion();
