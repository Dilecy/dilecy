import { isActionOf } from 'typesafe-actions';
import { filter, concatMap } from 'rxjs/operators';
import { fromThunky } from '../../store/thunky';
import { fetchProfiles, pushAlert, requestLogout } from '../../core/actions';
import { loginSuccess, deleteProfile } from '../Login/actions';
import { updateProfile, changeProfilePassword } from './actions';
import { ConsentAction } from '../../model/serverModel';
import { logout } from '../CreateProfile/actions';
import { Epic } from '../../store/root-epic';

export const updateProfileEpic: Epic = (action$, state$, { clientBackend }) =>
  action$.pipe(
    filter(isActionOf(updateProfile)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const { profile, profileDetails } = action.payload;
        try {
          const updatedProfileWithDetails = await clientBackend.updateProfile(
            {
              ...profile,
              profileName: profileDetails.profileName || profile.profileName
            },
            profileDetails
          );
          //TODO: Add proper update actions after state refactoring
          dispatch(fetchProfiles());
          dispatch(loginSuccess(updatedProfileWithDetails));
        } catch (error) {
          console.error(error);
        }
      })
    )
  );

export const changeProfilePasswordEpic: Epic = (
  action$,
  state$,
  { clientBackend }
) =>
  action$.pipe(
    filter(isActionOf(changeProfilePassword)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const { profile, oldPassword, newPassword } = action.payload;
        try {
          const updatedProfileWithDetails = await clientBackend.changeProfilePassword(
            profile,
            oldPassword,
            newPassword
          );
          //TODO: Add proper update actions after state refactoring
          dispatch(fetchProfiles());
          dispatch(loginSuccess(updatedProfileWithDetails));
        } catch (error) {
          console.error(error);
        }
      })
    )
  );

export const deleteProfileEpic: Epic = (
  action$,
  state$,
  { apiService, clientBackend }
) =>
  action$.pipe(
    filter(isActionOf(deleteProfile)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const { consent, profile } = action.payload;

        // delete user profile
        await clientBackend.deleteProfile(profile);

        if (consent.ux_research) {
          try {
            // revoke ux_research consent
            const emailConsent: ConsentAction = {
              action: 'revoked',
              purpose: 'ux_research',
              data: consent.ux_research || ''
            };
            await apiService.postConsent(emailConsent);
          } catch (error) {
            dispatch(pushAlert(error.message));
          }
        }

        dispatch(pushAlert('Profil erfolgreich gelöscht.'));
        dispatch(logout());
        dispatch(requestLogout());
      })
    )
  );
