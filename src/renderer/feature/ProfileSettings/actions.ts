import { createAction } from 'typesafe-actions';
import { SealedPassword } from '../../core/crypto/interface';
import { ProfileDetails, Profile } from '@dilecy/model';

export const updateProfile = createAction('UPDATE_PROFILE')<{
  profile: Profile;
  profileDetails: Partial<ProfileDetails>;
  sendRequest?: boolean;
}>();

export const changeProfilePassword = createAction('CHANGE_PROFILE_PASSWORD')<{
  profile: Profile;
  oldPassword: SealedPassword;
  newPassword: SealedPassword;
}>();
