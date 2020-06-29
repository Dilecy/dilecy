import { createReducer, RootAction } from 'typesafe-actions';
import { HomeState } from '../../store/stateModel';
import * as actions from './actions';

export const initialHomeState: HomeState = {
  updateInfo: {},
  showRatingMessage: false,
  showFeedbackMessage: false
};
export const homeStateReducer = createReducer<HomeState, RootAction>(
  initialHomeState
)
  .handleAction(actions.setUpdateInfo, (state, action) => ({
    ...state,
    updateInfo: { ...action.payload }
  }))
  .handleAction(actions.ratingDone, state => ({
    ...state,
    showRatingMessage: true
  }))
  .handleAction(actions.clearShowRating, state => ({
    ...state,
    showRatingMessage: false
  }))
  .handleAction(actions.feedbackDone, state => ({
    ...state,
    showFeedbackMessage: true
  }))
  .handleAction(actions.clearShowFeedback, state => ({
    ...state,
    showFeedbackMessage: false
  }));
