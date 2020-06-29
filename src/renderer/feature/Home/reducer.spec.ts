/* eslint-disable @typescript-eslint/camelcase */
import chai from 'chai';
import { homeStateReducer, initialHomeState } from './reducer';
import * as Actions from './actions';
chai.should();

describe('Reducer', function() {
  describe('homeStateReducer', function() {
    const initial = initialHomeState;
    const reducer = homeStateReducer;
    it('should show the rating done message', function() {
      return reducer(initial, Actions.ratingDone()).should.deep.equal({
        ...initial,
        showRatingMessage: true
      });
    });

    it('should hide the rating done message', function() {
      return reducer(initial, Actions.clearShowRating()).should.deep.equal({
        ...initial,
        showRatingMessage: false
      });
    });

    it('should show the feedback done message', function() {
      return reducer(initial, Actions.feedbackDone()).should.deep.equal({
        ...initial,
        showFeedbackMessage: true
      });
    });

    it('should hide the feedback done message', function() {
      return reducer(initial, Actions.clearShowFeedback()).should.deep.equal({
        ...initial,
        showFeedbackMessage: false
      });
    });
  });
});
