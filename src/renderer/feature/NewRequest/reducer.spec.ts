/* eslint-disable @typescript-eslint/camelcase */
import chai from 'chai';
import { initialNewRequestState, newRequestStateReducer } from './reducer';
import * as Actions from './actions';
chai.should();

describe('Reducer', function() {
  describe('newRequestReducer', function() {
    const initial = initialNewRequestState;
    const reducer = newRequestStateReducer;
    it('should add selected brand', function() {
      return reducer(
        initial,
        Actions.toggleBrandSelected({ id: 1, selected: true })
      ).should.deep.equal({
        ...initial,
        brandSelection: { 1: { recommended: false } }
      });
    });
    it('should remove deselected brand', function() {
      const initialState = {
        ...initial,
        brandSelection: { 1: { recommended: false } }
      };
      return reducer(
        initialState,
        Actions.toggleBrandSelected({ id: 1, selected: false })
      ).should.deep.equal({
        ...initial,
        brandSelection: {}
      });
    });

    it('should add selected recommended brand', function() {
      return reducer(
        initial,
        Actions.toggleRecommendedBrandSelected({ id: 10, selected: true })
      ).should.deep.equal({
        ...initial,
        brandSelection: { 10: { recommended: true } }
      });
    });

    it('should remove deselected recommended brand', function() {
      const initialState = {
        ...initial,
        brandSelection: { 10: { recommended: true } }
      };
      return reducer(
        initialState,
        Actions.toggleRecommendedBrandSelected({ id: 10, selected: false })
      ).should.deep.equal({
        ...initial,
        brandSelection: {}
      });
    });

    it('should all selected recommended brands', () => {
      const initialState = {
        ...initial,
        brandSelection: { 1: { recommended: false } }
      };
      return reducer(
        initialState,
        Actions.selectAllRecommendedBrands([2, 3, 4])
      ).should.deep.equal({
        ...initial,
        brandSelection: {
          1: { recommended: false },
          2: { recommended: true },
          3: { recommended: true },
          4: { recommended: true }
        }
      });
    });

    it('should remove all recommended brands', () => {
      const initialState = {
        ...initial,
        brandSelection: {
          1: { recommended: false },
          2: { recommended: true },
          3: { recommended: true },
          4: { recommended: true }
        }
      };
      return reducer(
        initialState,
        Actions.deselectAllRecommendedBrands()
      ).should.deep.equal({
        ...initial,
        brandSelection: {
          1: { recommended: false }
        }
      });
    });
  });
});
