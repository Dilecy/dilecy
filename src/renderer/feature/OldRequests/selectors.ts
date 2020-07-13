import { createSelector } from 'reselect';
import { RootState } from 'typesafe-actions';

const oldRequestsState = (state: RootState) => state.oldRequestsState;

export const selectOldRequests = createSelector(
  oldRequestsState,
  oldRequests => oldRequests.oldRequests
);
