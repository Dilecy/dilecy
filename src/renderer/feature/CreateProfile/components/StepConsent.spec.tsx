import React from 'react';
import chai, { expect } from 'chai';
import StepConsent from './StepConsent';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

chai.should();
const mockStore = configureMockStore([]);

describe('StepConsent component', () => {
  it('should render', () => {
    const store = mockStore({
      createProfileStatus: { profileData: {} }
    });

    const wrapper = shallow(
      <Provider store={store}>
        <StepConsent></StepConsent>
      </Provider>
    ).dive();
    expect(wrapper).to.not.be.null;
  });
});
