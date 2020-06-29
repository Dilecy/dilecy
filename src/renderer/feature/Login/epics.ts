import { filter, concatMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { fromThunky } from '../../store/thunky';
import {
  fetchRequests,
  selectView,
  addRequestGroups
} from '../../core/actions';
import { login, loginSuccess, doPing, blockApp } from './actions';
import { setConsent } from '../CreateProfile/actions';
import { addEmailRequests } from '../OldRequests/actions';
import { Epic } from '../../store/root-epic';
import moment from 'moment';

export const loginEpic: Epic = (
  action$,
  _,
  { clientBackend, loginSystem, tracker }
) =>
  action$.pipe(
    filter(isActionOf(login)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const { profile, sealedPassword } = action.payload;
        const isCompatible = await clientBackend.checkDbCompatibility(
          profile,
          sealedPassword
        );
        if (isCompatible) {
          const profileDetails = await clientBackend.getProfileDetails(
            profile,
            sealedPassword
          );
          if (profileDetails) {
            loginSystem.sealedPassword = sealedPassword;
            const consent = await clientBackend.getConsentStatus();
            dispatch(setConsent(consent));
            dispatch(loginSuccess({ profile, profileDetails }));
            tracker.event('profile', 'login');
            dispatch(doPing({ profile, profileDetails }));
            dispatch(fetchRequests());
            dispatch(selectView('home'));
          }
        } else {
          dispatch(blockApp());
        }
      })
    )
  );

export const fetchRequestsEpic: Epic = (action$, _, { clientBackend }) =>
  action$.pipe(
    filter(isActionOf(fetchRequests)),
    concatMap(() =>
      fromThunky(async dispatch => {
        const requestGroups = await clientBackend.getRequestGroups();
        dispatch(addRequestGroups(requestGroups));
        const requests = await clientBackend.getEmailRequests();
        dispatch(addEmailRequests(requests));
      })
    )
  );

export const doPingEpic: Epic = (action$, _, { clientBackend, apiService }) =>
  action$.pipe(
    filter(isActionOf(doPing)),
    concatMap(action =>
      fromThunky(async () => {
        const profileDate = await clientBackend.getProfileCreatedDate();
        const { profile, profileDetails } = action.payload;
        const { lastLogin } = profileDetails;

        const cohortId = moment(profileDate)
          .startOf('isoWeek')
          .format('YYYY-MM-DD');
        const isFirst = moment(lastLogin).month() !== moment().month();
        try {
          await apiService.postPing(cohortId, isFirst);
          await clientBackend.updateProfile(profile, {
            lastLogin: moment().format('YYYY-MM-DD')
          });
        } catch (e) {
          console.error('Ping flow error', e);
        }
      })
    )
  );
