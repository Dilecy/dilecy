/* eslint-disable @typescript-eslint/camelcase */
import { ajax } from 'rxjs/ajax';
import * as qs from 'querystring';
import { Tracker, TrackingIdResolver } from './interface';

// This is url is used so that Matomo can relate events and page visits
const dilecyDesktopUrl = 'http://dilecy-desktop';

interface TrackingEvent {
  _id?: string;
  url?: string;
  e_v?: number;
  [key: string]: string | number | undefined;
}

type TrackingFunction = (e: TrackingEvent) => void;

function createTrackerImpl(track: TrackingFunction): Tracker {
  let idResolver: TrackingIdResolver = () => undefined;
  return {
    setIdResolver: (resolver: TrackingIdResolver) => {
      idResolver = resolver;
    },
    pageVisit: (url: string, action: string) => {
      const _id = idResolver();
      track({
        _id,
        url: `${dilecyDesktopUrl}/page/${url}`,
        action_name: action
      });
    },
    event: (
      category: string,
      action: string,
      name?: string,
      value?: number
    ) => {
      const _id = idResolver();
      track({
        _id,
        url: dilecyDesktopUrl,
        e_c: category,
        e_a: action,
        e_n: name,
        e_v: value
      });
    }
  };
}

export function createTracker(serverUrl: string, siteId: number): Tracker {
  const tracker: TrackingFunction = e => {
    const query = {
      ...e,
      idsite: siteId,
      apiv: 1,
      rec: 1
    };
    Object.keys(query).forEach(k => k === undefined && delete query[k]);
    const url = `${serverUrl}/piwik.php?${qs.stringify(query)}`;
    const res = ajax.get(url).toPromise();
    res.then(console.log, console.error);
  };
  return createTrackerImpl(tracker);
}

export function createTrackerMock(): Tracker {
  const tracker: TrackingFunction = e => {
    console.log(e);
  };
  return createTrackerImpl(tracker);
}
