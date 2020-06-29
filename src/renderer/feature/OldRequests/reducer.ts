import { createReducer, RootAction } from 'typesafe-actions';
import { OldRequestsState } from '../../store/stateModel';
import * as Actions from './actions';

export const initialOldRequestState: OldRequestsState = {
  oldRequests: [],
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
  .handleAction(Actions.oldRequestsReceived, (state, action) => ({
    ...state,
    oldRequests: action.payload
  }))
  .handleAction(Actions.oldRequestsLoadingFinished, state => ({
    ...state,
    loading: false
  }));
