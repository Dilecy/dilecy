import {
  filter,
  concatMap,
  map,
  debounceTime,
  tap,
  ignoreElements
} from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import * as Actions from './actions';
import { blockApp } from '../feature/Login/actions';
import { fromThunky } from '../store/thunky';
import { getCurrentPage } from '../store/selectors/routing';
import { getFilteredBrandList } from '../store/selectors/newRequest';
import { setSelectSearchFilter } from '../feature/NewRequest/actions';
import { Epic } from '../store/root-epic';
import { logout } from '../feature/Login/actions';
import { abortProfile } from '../feature/CreateProfile/actions';

export const startupEpic: Epic = (
  action$,
  _,
  { apiService, clientBackend, tracker }
) =>
  action$.pipe(
    filter(isActionOf(Actions.appStarted)),
    concatMap(action =>
      fromThunky(async (dispatch, defer) => {
        const isCompatible = await clientBackend.checkDbCompatibility();
        if (isCompatible) {
          dispatch(Actions.fetchProfiles());
        } else {
          dispatch(blockApp());
        }
        const updateInfo = await apiService.checkForUpdate(
          action.payload.version
        );
        dispatch(Actions.setUpdateInfo(updateInfo));
        await defer(
          apiService
            .getDomains()
            .pipe(map(result => Actions.addDomains(result)))
        );

        const { version } = action.payload;
        const appData = await clientBackend.getAppData();

        if (appData.length) {
          const existingVersion = appData.find(x => x.version === version);
          if (!existingVersion) {
            // AppData table has no record for this version, update
            tracker.event('client', 'update');
            clientBackend.insertAppData({ version });
          }
        } else {
          // AppData table is empty, new installation
          tracker.event('client', 'install');
          clientBackend.insertAppData({ version });
        }
      })
    )
  );

//   tracking

const searchFilterTrackingDebounceTime = 2000;

export const trackPageVisitsEpic: Epic = (action$, state$, { tracker }) =>
  action$.pipe(
    filter(isActionOf([Actions.selectView, Actions.selectPage])),
    tap(() => {
      const state = state$.value;
      const page = getCurrentPage(state);
      if (state.loginStatus.loggedIn) {
        tracker.pageVisit(page, page);
      }
    }),
    ignoreElements()
  );

export const trackSearchFilterEpic: Epic = (action$, state$, { tracker }) =>
  action$.pipe(
    filter(isActionOf(setSelectSearchFilter)),
    debounceTime(searchFilterTrackingDebounceTime),
    tap(action => {
      const searchText = action.payload;
      if (searchText !== '') {
        const brands = getFilteredBrandList(state$.value);
        tracker.event(
          'new request',
          'brands filtered',
          searchText,
          brands.length
        );
      }
    }),
    ignoreElements()
  );

export const logoutEpic: Epic = (action$, _, { loginSystem, tracker }) =>
  action$.pipe(
    filter(isActionOf(Actions.requestLogout)),
    concatMap(() =>
      fromThunky(async dispatch => {
        loginSystem.logout();
        tracker.event('profile', 'logout');
        // TODO separate logout actions to do specific tasks instead of one action managing different parts of state
        // Actions can be removeLoggedInUser, // clearTracking // redirectToLoginPage etc
        dispatch(logout());
        dispatch(Actions.selectView('login'));
        dispatch(Actions.selectPage({ login: 'login' }));
        //clear any profile data stored during profile creation
        dispatch(abortProfile());
      })
    )
  );
