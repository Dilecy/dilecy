import chai from 'chai';
import * as TD from '../model/mock/testData';

import { initialClientData, clientDataReducer } from './reducer';
import * as Actions from './actions';

chai.should();

const requestGroupsMap = TD.requestGroups.reduce(
  (o, rg) => Object.assign(o, { [rg.id]: rg }),
  {}
);

describe('Reducer', function() {
  describe('clientDataReducer', function() {
    const initial = initialClientData;
    const reducer = clientDataReducer;
    it('should handle addRequestGroups', function() {
      const addRecommends = Actions.addRequestGroups(TD.requestGroups);
      return reducer(initial, addRecommends).should.deep.equal({
        ...initial,
        requestGroup: requestGroupsMap
      });
    });
  });
});
