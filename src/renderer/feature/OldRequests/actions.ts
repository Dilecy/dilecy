import { createAction } from 'typesafe-actions';
import {
  RequestGroupDataStatus,
  EmailRequest,
  RequestGroup
} from '@dilecy/model';
import { RequestGroupListItem } from '../../store/stateModel';

export const setRequestSearchFilter = createAction('SET_REQUEST_SEARCH_FILTER')<
  string
>();
export const applyRequestSearchFilter = createAction(
  'APPLY_REQUEST_SEARCH_FILTER'
);
export const setRequestList = createAction('SET_REQUEST_LIST')<
  RequestGroupListItem[]
>();

export const addEmailRequests = createAction('ADD_EMAIL_REQUESTS')<
  EmailRequest[]
>();

export const oldRequestsRequested = createAction(
  '[Old Requests] Fetch Requested'
)<void>();
export const oldRequestsLoadingStarted = createAction(
  '[Old Requests] Loading started'
)<void>();
export const oldRequestsLoadingFinished = createAction(
  '[Old Requests] Loading Finished'
)<void>();
export const oldRequestsReceived = createAction('[Old Requests] Data Received')<
  RequestGroup[]
>();
export const oldRequestsRequestFailed = createAction(
  '[Old Requests] Request Failed'
)();

export const updateRequestGroup = createAction(
  '[Old Requests] Update Request Group'
)<RequestGroup>();

// TODO Remove this action once playground component is removed
export const testActionToUpdateRequestGroup = createAction(
  '[Old Requests] TEST ACTION'
)<{ id: number; dateTimeCreated: string; snoozeCount: number }>();
