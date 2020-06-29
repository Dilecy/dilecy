import { createSelector } from 'reselect';
import { RootState } from 'typesafe-actions';

export const getActiveStep = createSelector(
  (state: RootState) => state.createProfileStatus,
  s => s.activeStep
);

export const getProfileData = createSelector(
  (state: RootState) => state.createProfileStatus,
  s => s.profileData
);

export const getLoggedInProfileDetails = createSelector(
  (state: RootState) => state.loginStatus,
  s => s.loggedIn && s.loggedIn.profileDetails
);

export const getLoggedInProfile = createSelector(
  (state: RootState) => state.loginStatus,
  s => s.loggedIn && s.loggedIn.profile
);
