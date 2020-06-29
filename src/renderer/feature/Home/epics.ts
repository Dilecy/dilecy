import { filter, concatMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import {
  startRating,
  ratingDone,
  startFeedback,
  feedbackDone
} from './actions';
import { fromThunky } from '../../store/thunky';
import { pushAlert, fetchProfiles } from '../../core/actions';

import { Epic } from '../../store/root-epic';
import { loginSuccess } from '../Login/actions';
import { RatingResponse } from '../../model/serverModel';

export const startRatingEpic: Epic = (
  action$,
  state$,
  { clientBackend, apiService }
) =>
  action$.pipe(
    filter(isActionOf(startRating)),
    concatMap(action =>
      fromThunky(async dispatch => {
        const state = state$.value;
        try {
          let apiResponse: RatingResponse;
          const {
            ratingId,
            ratingPassword
          } = state.loginStatus.loggedIn!.profileDetails;
          if (ratingId && ratingPassword) {
            apiResponse = await apiService.patchRating(
              action.payload,
              ratingId,
              ratingPassword
            );
          } else {
            apiResponse = await apiService.postRating(action.payload);
          }

          const updatedProfileWithDetails = await clientBackend.updateProfile(
            state.loginStatus.loggedIn!.profile,
            {
              ...state.loginStatus.loggedIn!.profileDetails,
              rating: action.payload,
              ratingId: apiResponse.id,
              ratingPassword: apiResponse.password
            }
          );

          dispatch(fetchProfiles());
          dispatch(loginSuccess(updatedProfileWithDetails));
          dispatch(ratingDone());
        } catch (error) {
          dispatch(pushAlert(error.message));
        }
      })
    )
  );

export const startFeedbackEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    filter(isActionOf(startFeedback)),
    concatMap(action =>
      fromThunky(async dispatch => {
        try {
          await apiService.postFeedback(action.payload);
          dispatch(feedbackDone());
        } catch (error) {
          dispatch(pushAlert(error.message));
        }
      })
    )
  );
