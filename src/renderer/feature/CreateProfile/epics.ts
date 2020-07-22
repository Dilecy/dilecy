/* eslint-disable @typescript-eslint/camelcase */

import {
  createProfile,
  setConsent,
  postConsent,
  abortProfile,
  submitProfile
} from './actions';
import { concatMap, filter, concatMapTo } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { fromThunky } from '../../store/thunky';
import { ConsentAction } from '../../model/serverModel';
import { doPing, loginSuccess, setProfiles } from '../Login/actions';
import {
  pushAlert,
  setWelcomeMessageToggle,
  selectView,
  fetchProfiles,
  selectPage
} from '../../core/actions';
import { Epic } from '../../store/root-epic';

const cannotPostResearchConsent = 'Unable to post UX research consent.';

export const submitProfileEpic: Epic = (
  action$,
  state$,
  { sealPassword, rng }
) =>
  action$.pipe(
    filter(isActionOf(submitProfile)),
    concatMap(() =>
      fromThunky(async dispatch => {
        const values = state$.value.createProfileStatus.profileData;
        const sealedPassword = sealPassword(values.password!);
        const email = {
          emailAddress: values.emailAddress!,
          isPrimary: true,
          smtp: values.smtp!,
          smtpPort: values.smtpPort!,
          smtpUser: values.smtpUser!,
          encyptedPassword: await sealedPassword.encrypt(values.emailPassword!),
          refreshToken: await sealedPassword.encrypt(values.refreshToken!),
          isGoogle: values.isGoogle
        };
        const profileDetails = {
          profileName: values.profileName!,
          emailAccounts: [email]
        };
        const { tracking, ux_research } = values;
        dispatch(
          createProfile({
            sealedPassword,
            profileDetails,
            consent: {
              tracking: tracking ? await rng.generateVisitorId() : undefined,
              ux_research: ux_research ? email.emailAddress : undefined
            }
          })
        );
      })
    )
  );

export const createProfileEpic: Epic = (
  action$,
  state$,
  { clientBackend, loginSystem, rng, tracker, apiService }
) =>
  action$.pipe(
    filter(isActionOf(createProfile)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const { sealedPassword, profileDetails, consent } = action.payload;
        loginSystem.sealedPassword = sealedPassword;
        const created = await clientBackend.createProfile(
          sealedPassword,
          await rng.generateKey(),
          {
            ...profileDetails
          }
        );
        const profiles = [
          ...state$.value.loginStatus.profiles,
          created.profile
        ];

        dispatch(setProfiles(profiles));
        const consentActions: ConsentAction[] = [];
        if (consent.ux_research) {
          try {
            const consentAction: ConsentAction = {
              purpose: 'ux_research',
              action: 'given',
              data: consent.ux_research
            };
            await apiService.postConsent(consentAction);
            consentActions.push(consentAction);
          } catch (error) {
            dispatch(pushAlert(cannotPostResearchConsent));
          }
        }
        if (consent.tracking) {
          const action: ConsentAction = {
            purpose: 'tracking',
            action: 'given',
            data: consent.tracking
          };
          consentActions.push(action);
        }
        await clientBackend.storeConsentActions(consentActions);
        dispatch(setConsent(consent));
        dispatch(loginSuccess(created));
        tracker.event('profile', 'login');
        dispatch(doPing(created));
        dispatch(selectView('home'));
        dispatch(setWelcomeMessageToggle(true));
      })
    )
  );

export const postConsentEpic: Epic = (
  action$,
  state$,
  { apiService, clientBackend }
) =>
  action$.pipe(
    filter(isActionOf(postConsent)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const consentActions: ConsentAction[] = [];
        for (const a of action.payload) {
          if (a.purpose === 'ux_research') {
            try {
              await apiService.postConsent(a);
              consentActions.push(a);
            } catch (error) {
              dispatch(pushAlert(cannotPostResearchConsent));
            }
          } else {
            consentActions.push(a);
          }
        }
        try {
          await clientBackend.storeConsentActions(consentActions);
          const consent = await clientBackend.getConsentStatus();
          dispatch(setConsent(consent));
        } catch (error) {
          dispatch(pushAlert(error.message || ''));
        }
      })
    )
  );

export const getProfilesEpic: Epic = (action$, _, { clientBackend }) =>
  action$.pipe(
    filter(isActionOf(fetchProfiles)),
    concatMapTo(
      fromThunky(async dispatch => {
        const profiles = await clientBackend.getProfiles();
        dispatch(setProfiles(profiles));
      })
    )
  );

export const abortProfileEpic: Epic = action$ =>
  action$.pipe(
    filter(isActionOf(abortProfile)),
    concatMapTo(
      fromThunky(async dispatch => {
        dispatch(selectPage({ login: 'login' }));
      })
    )
  );
