import React from 'react';
import chai, { expect } from 'chai';
import CompleteProfileModal from './CompleteProfileModal';
import { shallow } from 'enzyme';
import * as types from '../../../store/types';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { STEP_PROFILE } from '../profile-types';

chai.should();
const mockStore = configureMockStore([]);

describe('CompleteProfileModal component', () => {
  it('should render', () => {
    const store = mockStore({
      createProfileStatus: { activeStep: STEP_PROFILE }
    });

    const wrapper = shallow(
      <Provider store={store}>
        <CompleteProfileModal></CompleteProfileModal>
      </Provider>
    ).dive();
    expect(wrapper).to.not.be.null;
  });
});
