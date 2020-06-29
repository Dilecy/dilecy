import { createAction } from 'typesafe-actions';
import { UpdateInfo } from '../../model/serverModel';

export const setUpdateInfo = createAction('SET_UPDATE_INFO')<
  Partial<UpdateInfo>
>();

export const startRating = createAction('START_RATING')<number>();

export const ratingDone = createAction('RATING_DONE')<void>();

export const clearShowRating = createAction('CLEAR_SHOW_RATING')<void>();

export const startFeedback = createAction('START_FEEDBACK')<string>();

export const feedbackDone = createAction('FEEDBACK_DONE')<void>();

export const clearShowFeedback = createAction('CLEAR_SHOW_FEEDBACK')<void>();
