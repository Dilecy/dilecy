import * as Actions from './actions';
import { initialOldRequestState, oldRequestsStateReducer } from './reducer';
import { requestGroups, requestGroupMap } from '../../model/mock/testData';

describe('old requests reducer', () => {
  const initialState = initialOldRequestState;
  const reducer = oldRequestsStateReducer;
  const mockOldRequests = requestGroups;
  it('should set loading to true on handling action oldRequestsLoadingStarted', () => {
    const action = Actions.oldRequestsLoadingStarted();
    return reducer(initialState, action).should.deep.equal({
      ...initialState,
      loading: true
    });
  });

  it('should set loading to false on handling action oldRequestsLoadingFinished', () => {
    const action = Actions.oldRequestsLoadingFinished();
    return reducer(initialState, action).should.deep.equal({
      ...initialState,
      loading: false
    });
  });

  it('should set old requests data to state on handling action oldRequestsReceived', () => {
    const action = Actions.oldRequestsReceived(mockOldRequests);
    return reducer(initialState, action).should.deep.equal({
      ...initialState,
      oldRequests: requestGroupMap,
      byId: [1, 2]
    });
  });
});
