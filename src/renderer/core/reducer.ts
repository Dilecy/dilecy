import {
  AppInfo,
  PageSelection,
  ViewSelection,
  ServerData,
  ClientData
} from '../store/stateModel';
import { createReducer, RootAction } from 'typesafe-actions';
import * as Actions from './actions';
import { logout } from '../feature/CreateProfile/actions';
import {
  addEmailRequests,
  setDataStatus
} from '../feature/OldRequests/actions';
import { setAuthAnswerText } from '../feature/NewRequest/actions';

const initialAppInfo: AppInfo = {
  version: ''
};
export const appInfoReducer = createReducer<AppInfo, RootAction>(
  initialAppInfo
).handleAction(Actions.appStarted, (_, action) => action.payload);

const initialAlerts: string[] = [];
export const alertReducer = createReducer<string[], RootAction>(initialAlerts)
  .handleAction(Actions.pushAlert, (state, action) => [
    ...state,
    action.payload
  ])
  .handleAction(Actions.dismissAlert, (state, action) =>
    state.filter((alert, index) => index !== action.payload)
  );

const initialPageSelection: PageSelection = {
  login: 'login',
  newRequest: 'choose'
};
export const pageSelectionReducer = createReducer<PageSelection, RootAction>(
  initialPageSelection
)
  .handleAction(Actions.selectPage, (state, action) => ({
    ...state,
    ...action.payload
  }))
  .handleAction(logout, () => ({
    ...initialPageSelection
  }));

const initialViewSelection: ViewSelection = 'login';
export const viewSelectionReducer = createReducer<ViewSelection, RootAction>(
  initialViewSelection as ViewSelection
)
  .handleAction(Actions.selectView, (_, action) => action.payload)
  .handleAction(logout, () => 'login');

// TODO make it more generic based on requirement
export const welcomeMessageReducer = createReducer<boolean, RootAction>(
  false
).handleAction(Actions.setWelcomeMessageToggle, (_, action) => action.payload);

export const initialServerData: ServerData = {
  domain: {}
};
export const serverDataReducer = createReducer<ServerData, RootAction>(
  initialServerData
).handleAction(Actions.addDomains, (state, action) => {
  const domain = { ...state.domain };
  action.payload.forEach(v => (domain[v.fqdn] = v));
  const newState = {
    ...state,
    domain
  };
  return newState;
});

export const initialClientData: ClientData = {
  requestGroup: {},
  emailRequest: {},
  authA: {}
};
export const clientDataReducer = createReducer<ClientData, RootAction>(
  initialClientData
)
  .handleAction(logout, () => ({
    ...initialClientData
  }))
  .handleAction(Actions.addRequestGroups, (state, action) => {
    const requestGroup = { ...state.requestGroup };
    action.payload.forEach(rg => {
      requestGroup[rg.id] = { ...rg };
    });
    return {
      ...state,
      requestGroup
    };
  })
  .handleAction(addEmailRequests, (state, action) => {
    const emailRequest = { ...state.emailRequest };
    action.payload.forEach(er => {
      emailRequest[er.id] = { ...er };
    });
    return {
      ...state,
      emailRequest
    };
  })
  .handleAction([Actions.addAuthAs, Actions.createAuthAs], (state, action) => {
    const authA = { ...state.authA };
    action.payload.forEach(aa => {
      authA[aa.id] = aa;
    });
    return {
      ...state,
      authA
    };
  })
  .handleAction(setAuthAnswerText, (state, action) => {
    const authA = { ...state.authA };
    const { id, text } = action.payload;
    const a = authA[id];
    if (a) {
      authA[id] = { ...a, answer: text };
    }
    return {
      ...state,
      authA
    };
  })
  .handleAction(setDataStatus, (state, action) => {
    const requestGroup = { ...state.requestGroup };
    const { id, dataStatus } = action.payload;
    const rg = requestGroup[id];
    if (rg) {
      requestGroup[id] = { ...rg, dataStatus };
    }
    return {
      ...state,
      requestGroup
    };
  });
