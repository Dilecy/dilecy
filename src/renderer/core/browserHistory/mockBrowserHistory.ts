/* eslint-disable @typescript-eslint/camelcase */
import { BrowserHistory } from 'node-browser-history';

export const getMockBrowserHistory = async (timeInMins: number) => {
  const mockBrowserHistory: BrowserHistory[] = [
    {
      browser: 'Mozilla Firefox',
      title: 'Test Website',
      url: 'https://mail.google.com',
      utc_time: 12343
    },
    {
      browser: 'Google Chrome',
      title: 'Another Test Website',
      url: 'https://www.github.com',
      utc_time: 12343
    }
  ];
  return new Promise((resolve, reject) => {
    // Setting 5000 ms time
    setTimeout(resolve, 5000);
  }).then(function() {
    return mockBrowserHistory;
  });
};
