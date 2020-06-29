import { createAction } from 'typesafe-actions';
import { SealedPassword } from '../../core/crypto/interface';
import { ProfileCreate } from '../../model/clientModel';
import { ConsentStatus, CreateProfileData } from '../../store/stateModel';
import { ConsentAction } from '../../model/serverModel';

export const createProfile = createAction('CREATE_PROFILE')<{
  sealedPassword: SealedPassword;
  profileDetails: ProfileCreate;
  consent: ConsentStatus;
}>();

export const postConsent = createAction('POST_CONSENT')<ConsentAction[]>();
export const setConsent = createAction('SET_CONSENT')<Partial<ConsentStatus>>();
export const logout = createAction('LOGOUT')<void>();

export const setProfileStep = createAction('SET_PROFILE_STEP')<{
  stepName: string;
}>();
export const setProfileStepData = createAction('SET_PROFILE_STEP_DATA')<
  Partial<CreateProfileData>
>();
export const abortProfile = createAction('ABORT_PROFILE')();

export const submitProfile = createAction('SUBMIT_PROFILE')();
