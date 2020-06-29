import React from 'react';
import chai, { expect } from 'chai';
import CreateProfileForm from './CreateProfilePage';
import { shallow } from 'enzyme';
import * as types from '../../../store/types';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { STEP_PROFILE } from '../profile-types';

chai.should();
const mockStore = configureMockStore([]);

describe('CreateProfileForm component', () => {
  it('should render', () => {
    const store = mockStore({
      createProfileStatus: { activeStep: STEP_PROFILE }
    });

    const wrapper = shallow(
      <Provider store={store}>
        <CreateProfileForm></CreateProfileForm>
      </Provider>
    ).dive();
    expect(wrapper).to.not.be.null;
  });
});
