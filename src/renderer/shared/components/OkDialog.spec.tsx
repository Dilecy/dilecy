import React from 'react';
import chai, { expect } from 'chai';
import { OkDialog } from './OkDialog';
import { mount } from 'enzyme';

chai.should();

describe('OkDialog component', () => {
  it('should render', () => {
    const wrapper = mount(
      <OkDialog
        title={'Hello'}
        description={'World'}
        closeText={'Close'}
        onClose={() => {}}
      />
    );
    expect(wrapper).to.not.be.null;
    expect(wrapper.find('h4').text()).to.eq('Hello');
  });

  it('should have proper content', () => {
    const wrapper = mount(
      <OkDialog
        title={'Hello'}
        description={'World'}
        closeText={'Close'}
        onClose={() => {}}
      />
    );

    expect(wrapper.find('h4').text()).to.eq('Hello');
    expect(wrapper.find('p').text()).to.eq('World');
    expect(wrapper.find('button').text()).to.eq('Close');
  });
});
