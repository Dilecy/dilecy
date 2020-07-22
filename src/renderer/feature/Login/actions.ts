import { createAction } from 'typesafe-actions';
import { SealedPassword } from '../../core/crypto/interface';
import { Profile, ProfileDetails } from '@dilecy/model';
import { ConsentStatus } from '../../store/stateModel';

const LOGIN = 'login/LOGIN';
const LOGIN_SUCCESS = 'login/LOGIN_SUCCESS';
const LOGOUT = 'login/LOGOUT';
const SET_PROFILES = 'login/SET_PROFILES';
const DELETE_PROFILE = 'login/DELETE_PROFILE';
const DO_PING = 'login/DO_PING';
const BLOCK_APP = 'login/BLOCK_APP';

export const login = createAction(LOGIN)<{
  profile: Profile;
  sealedPassword: SealedPassword;
}>();
export const loginSuccess = createAction(LOGIN_SUCCESS)<{
  profile: Profile;
  profileDetails: ProfileDetails;
}>();
export const logout = createAction(LOGOUT)<void>();
export const setProfiles = createAction(SET_PROFILES)<Profile[]>();
export const deleteProfile = createAction(DELETE_PROFILE)<{
  profile: Profile;
  consent: ConsentStatus;
}>();
export const doPing = createAction(DO_PING)<{
  profile: Profile;
  profileDetails: ProfileDetails;
}>();
export const blockApp = createAction(BLOCK_APP)<void>();
