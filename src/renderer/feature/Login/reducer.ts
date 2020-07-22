import { LoginStatus } from '@dilecy/store';
import { createReducer, RootAction } from 'typesafe-actions';
import * as actions from './actions';

const initialLoginStatus: LoginStatus = {
  loggedIn: undefined,
  profiles: [],
  blocked: false
};

export const loginReducer = createReducer<LoginStatus, RootAction>(
  initialLoginStatus
)
  .handleAction(actions.loginSuccess, (state, action) => ({
    ...state,
    loggedIn: action.payload
  }))
  .handleAction(actions.logout, state => ({
    ...state,
    loggedIn: undefined
  }))
  .handleAction(actions.setProfiles, (state, action) => ({
    ...state,
    profiles: [...action.payload]
  }))
  .handleAction(actions.deleteProfile, (state, action) => ({
    ...state,
    profiles: state.profiles.filter(
      profile => profile.id !== action.payload.profile.id
    )
  }))
  .handleAction(actions.blockApp, state => ({
    ...state,
    blocked: true
  }));
