/* eslint-disable @typescript-eslint/camelcase */
import { getAllHistory } from 'node-browser-history';

/**
 * Fetches all browser history.
 * By default, it fetches history for 1 day if no time is specified.
 * @param timeinMinutes
 * @returns {Promise<BrowserHistory[]>}
 */

export const getBrowserHistoryAsync = async (timeinMinutes: number) => {
  return new Promise(resolve => {
    // Setting a slight delay time delay
    setTimeout(resolve, 400);
  }).then(() => getAllHistory(timeinMinutes));
};
