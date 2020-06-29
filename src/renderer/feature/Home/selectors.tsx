import { createSelector } from 'reselect';
import { RootState } from 'typesafe-actions';

export const getPrimaryEmail = createSelector(
  (state: RootState) => state.loginStatus,
  s =>
    s.loggedIn &&
    s.loggedIn.profileDetails &&
    s.loggedIn.profileDetails.emailAccounts &&
    s.loggedIn.profileDetails.emailAccounts.find(a => a.isPrimary)
);

export const getRating = createSelector(
  (state: RootState) => state.loginStatus,
  s =>
    s.loggedIn && s.loggedIn.profileDetails && s.loggedIn.profileDetails.rating
);

export const getShowRatingMessage = createSelector(
  (state: RootState) => state.homeState,
  s => s.showRatingMessage
);

export const getShowFeedbackMessage = createSelector(
  (state: RootState) => state.homeState,
  s => s.showFeedbackMessage
);

export const getTotalDomains = createSelector(
  (state: RootState) => state.serverData,
  s => Object.keys(s.domain).length
);
