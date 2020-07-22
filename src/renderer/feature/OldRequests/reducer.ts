import { createReducer, RootAction } from 'typesafe-actions';
import { OldRequestsState } from '../../store/stateModel';
import * as Actions from './actions';
import { IdMap } from '@dilecy/store';
import { RequestGroup } from '@dilecy/model';

export const initialOldRequestState: OldRequestsState = {
  oldRequests: {},
  byId: [],
  loading: false
};
export const oldRequestsStateReducer = createReducer<
  OldRequestsState,
  RootAction
>(initialOldRequestState)
  .handleAction(Actions.oldRequestsLoadingStarted, state => ({
    ...state,
    loading: true
  }))
  .handleAction(Actions.oldRequestsReceived, (state, action) => {
    const initialOldRequests: IdMap<RequestGroup> = {};
    const oldRequests = action.payload.reduce((prev, curr) => {
      if (!prev[curr.id]) {
        prev[curr.id] = curr;
      }
      return prev;
    }, initialOldRequests);
    const oldRequestsById = action.payload.map(data => data.id);
    return { ...state, oldRequests, byId: oldRequestsById };
  })
  .handleAction(Actions.oldRequestsLoadingFinished, state => ({
    ...state,
    loading: false
  }))
  .handleAction(Actions.updateRequestGroup, (state, action) => ({
    ...state,
    oldRequests: {
      ...state.oldRequests,
      [action.payload.id]: action.payload
    }
  }))
  .handleAction(Actions.testActionToUpdateRequestGroup, (state, action) => ({
    ...state,
    oldRequests: {
      ...state.oldRequests,
      [action.payload.id]: {
        ...state.oldRequests[action.payload.id],
        snoozeCount: action.payload.snoozeCount,
        dateTimeCreated: action.payload.dateTimeCreated
      }
    }
  }));
