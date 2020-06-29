import { createAction } from 'typesafe-actions';
import { PageSelection, ViewSelection, AppInfo } from '../store/stateModel';
import { AuthenticationAnswer, RequestGroup } from '../model/clientModel';
import { UpdateInfo, Domain } from '../model/serverModel';

// Alerts
export const pushAlert = createAction('[Global Alert] Push Alert')<string>();
export const dismissAlert = createAction('[Global Alert] Dismiss Alert')<
  number
>();

// Routing
export const selectView = createAction('[Routing] Select View')<
  ViewSelection
>();
// TODO This action along with its associated State needs improvement. The action as well as the state is a bit confusing
export const selectPage = createAction('[Routing] Select Page')<
  Partial<PageSelection>
>();

// Client Data
export const fetchRequests = createAction('FETCH_REQUESTS')<void>();
export const addRequestGroups = createAction('ADD_REQUEST_GROUPS')<
  RequestGroup[]
>();

export const addAuthAs = createAction('ADD_AUTH_AS')<AuthenticationAnswer[]>();
export const createAuthAs = createAction('CREATE_AUTH_AS')<
  AuthenticationAnswer[]
>();

//server data
// TODO instead of a separate state for server data, it can be moved to the feature where it is required
export const addDomains = createAction('ADD_DOMAINS')<Domain[]>();

export const appStarted = createAction('[App Launch] AppStarted')<AppInfo>();

export const setWelcomeMessageToggle = createAction('WELCOME_MESSAGE_TOGGLE')<
  boolean
>();

export const requestLogout = createAction('[TopBar] Request Logout')<void>();

export const fetchProfiles = createAction('FETCH_PROFILES')<void>();

export const setUpdateInfo = createAction('SET_UPDATE_INFO')<
  Partial<UpdateInfo>
>();
