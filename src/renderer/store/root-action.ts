import { createProfileActions } from '../feature/CreateProfile';
import { loginActions } from '../feature/Login';
import { homeActions } from '../feature/Home';
import { newRequestActions } from '../feature/NewRequest';
import { oldRequestActions } from '../feature/OldRequests';
import { coreActions } from '../core';

export default {
  createProfile: createProfileActions,
  login: loginActions,
  home: homeActions,
  newRequest: newRequestActions,
  oldRequest: oldRequestActions,
  coreAction: coreActions
};
