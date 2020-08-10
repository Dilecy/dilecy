import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import {
  LogoutIcon,
  UserIcon,
  GoogleIcon,
  SettingsIcon,
  PlusIcon
} from './Icon';

describe('Icon tests', () => {
  it('should render without errors', () => {
    const component = mount(
      <div>
        <LogoutIcon></LogoutIcon>
        <UserIcon></UserIcon>
        <GoogleIcon></GoogleIcon>
        <PlusIcon></PlusIcon>
        <SettingsIcon></SettingsIcon>
      </div>
    );
    expect(component).not.to.be.undefined;
  });
});
