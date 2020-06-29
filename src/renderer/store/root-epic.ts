import { combineEpics, createEpicMiddleware } from 'redux-observable';
import {
  createProfileEpic,
  postConsentEpic,
  getProfilesEpic,
  abortProfileEpic,
  submitProfileEpic
} from '../feature/CreateProfile/epics';
import {
  addMissingBrandEpic,
  browserHistoryEpic,
  newRequestDoneEpic,
  confirmAndSendEpic,
  requestTypeEpic,
  fetchEmailTemplatesEpic,
  fetchBrandsAndTagsEpic,
  fetchSearchedBrandsEpic,
  fetchTagsEpic,
  fetchFilteredBrandsByTagsEpic,
  fetchRecommendedBrandsEpic
} from '../feature/NewRequest/epics';
import {
  startupEpic,
  trackPageVisitsEpic,
  trackSearchFilterEpic,
  logoutEpic
} from '../core/epics';
import {
  loginEpic,
  fetchRequestsEpic,
  doPingEpic
} from '../feature/Login/epics';
import {
  changeProfilePasswordEpic,
  deleteProfileEpic,
  updateProfileEpic
} from '../feature/ProfileSettings/epics';
import { startRatingEpic, startFeedbackEpic } from '../feature/Home/epics';

import { RootAction, RootState } from 'typesafe-actions';
import {
  Epic as ReduxEpic,
  EpicMiddleware as ReduxEpicMiddleware
} from 'redux-observable';
import { Dependencies } from '../core/dependencies';
import { catchError } from 'rxjs/operators';
import { AjaxError } from 'rxjs/ajax';
import { pushAlert } from '../core/actions';
import { of } from 'rxjs';
import { fetchOldRequestsEpic } from '../feature/OldRequests/epics';
import { localization as localizations } from '../shared/localization';

/**
 * Root Epic with with error handler to catch all kind of async actions errors. If error occurs, it resubscibes to the original stream and continues the epic flow.
 * @param action$
 * @param store$
 * @param dependencies
 */
export const rootEpic: Epic = (action$, store$, dependencies) =>
  combineEpics(
    getProfilesEpic,
    abortProfileEpic,
    createProfileEpic,
    submitProfileEpic,
    updateProfileEpic,
    changeProfilePasswordEpic,
    loginEpic,
    deleteProfileEpic,
    logoutEpic,
    fetchEmailTemplatesEpic,
    fetchBrandsAndTagsEpic,
    fetchTagsEpic,
    fetchSearchedBrandsEpic,
    fetchFilteredBrandsByTagsEpic,
    fetchRecommendedBrandsEpic,
    fetchOldRequestsEpic,
    startupEpic,
    fetchRequestsEpic,
    confirmAndSendEpic,
    newRequestDoneEpic,
    postConsentEpic,
    browserHistoryEpic,
    addMissingBrandEpic,
    requestTypeEpic,
    doPingEpic,
    startRatingEpic,
    startFeedbackEpic,

    trackPageVisitsEpic,
    trackSearchFilterEpic
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      /**
       * Generic error handler
       *
       */
      if (error instanceof AjaxError) {
        // Server side error
        return of(pushAlert(localizations.INTERNET_CONNECTION_ERROR));
      } else {
        // client side error
      }
      return source;
    })
  );

export type EpicMiddleware = ReduxEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Dependencies
>;

export type Epic = ReduxEpic<RootAction, RootAction, RootState, Dependencies>;

export function configureEpicMiddleware(
  dependencies: Dependencies
): EpicMiddleware {
  return createEpicMiddleware({
    dependencies
  });
}
