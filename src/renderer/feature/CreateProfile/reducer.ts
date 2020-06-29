/* eslint-disable @typescript-eslint/camelcase */
import { createReducer, RootAction } from 'typesafe-actions';
import { ConsentStatus, CreateProfileStatus } from '../../store/stateModel';
import * as actions from './actions';
import { STEP_PROFILE } from './profile-types';

const initialConsentState: ConsentStatus = {
  tracking: undefined,
  ux_research: undefined
};
export const consentReducer = createReducer<ConsentStatus, RootAction>(
  initialConsentState
)
  .handleAction(actions.setConsent, (state, action) => ({
    ...state,
    ...action.payload
  }))
  .handleAction(actions.logout, () => initialConsentState);

const initialProfileState: CreateProfileStatus = {
  activeStep: STEP_PROFILE,
  profileData: {
    tracking: false,
    ux_research: false,
    emailAddress: '',
    emailPassword: '',
    smtp: '',
    smtpPort: 0,
    smtpUser: ''
  }
};
export const createProfileReducer = createReducer<
  CreateProfileStatus,
  RootAction
>(initialProfileState)
  .handleAction(actions.setProfileStep, (state, action) => ({
    ...state,
    activeStep: action.payload.stepName
  }))
  .handleAction(actions.setProfileStepData, (state, action) => ({
    ...state,
    profileData: {
      ...state.profileData,
      ...action.payload
    }
  }))
  .handleAction(actions.abortProfile, (state, action) => initialProfileState);
