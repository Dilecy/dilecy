import React from 'react';
import chai, { expect } from 'chai';
import StepEmail from './StepEmail';
import { shallow } from 'enzyme';
import * as types from '../../../store/types';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

chai.should();
const mockStore = configureMockStore([]);

describe('StepEmail component', () => {
  it('should render', () => {
    const store = mockStore({
      createProfileStatus: { profileData: {} }
    });

    const wrapper = shallow(
      <Provider store={store}>
        <StepEmail></StepEmail>
      </Provider>
    ).dive();
    expect(wrapper).to.not.be.null;
  });
});
