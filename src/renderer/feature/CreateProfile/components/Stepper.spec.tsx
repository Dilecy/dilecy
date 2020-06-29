import React from 'react';
import chai, { expect } from 'chai';
import Stepper from './CustomStepper';
import { shallow } from 'enzyme';

chai.should();

describe('Stepper component', () => {
  it('should render', () => {
    const wrapper = shallow(
      <Stepper active={''} steps={[]} width={'100'}></Stepper>
    );
    expect(wrapper).to.not.be.null;
  });
});
