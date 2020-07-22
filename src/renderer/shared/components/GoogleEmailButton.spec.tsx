import React from 'react';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { DependencyInjector } from '../../core/dependencies';
import { GoogleEmailButton } from './GoogleEmailButton';
import { sealPassword, rng } from '../../core/crypto/password.mock';
import { LoginSystem } from '../../feature/Login/login';
import { createInMemoryClientBackend } from '../../model/mock/clientBackend';
import { createApiService } from '../../core/api/api-service';
import { createMailerMock } from '../../core/mailer/mailerMock';
import { createTracker } from '../../core/tracker/tracker';
import { getMockBrowserHistory } from '../../core/browserHistory/mockBrowserHistory';
import { createGoogleAuthMock } from '../../core/google/googleAuthMock';
import Button from '@material-ui/core/Button';
import { EmailAccount } from '@dilecy/model';

describe('GoogleEmailButton tests', () => {
  const browserHistory = (timeInMins: number) =>
    getMockBrowserHistory(timeInMins);

  const dependencies = {
    sealPassword,
    rng,
    loginSystem: new LoginSystem(),
    clientBackend: createInMemoryClientBackend(),
    apiService: createApiService(''),
    mailer: createMailerMock(1),
    tracker: createTracker('', 1),
    browserHistory,
    googleAuth: createGoogleAuthMock()
  };

  it('should render in view mode', () => {
    const component = mount(
      <DependencyInjector value={dependencies}>
        <GoogleEmailButton
          emailAddress={'a@a.aa'}
          isEditMode={false}
          updateEmailSettings={async () => {}}
        ></GoogleEmailButton>
      </DependencyInjector>
    );
    chai.expect(component).not.to.be.undefined;
    chai.expect(component.find('#removeButton').length).to.eq(0);
    chai.expect(component.find('#googleButton').length).to.eq(0);
  });

  it('should render in edit mode when there is no email address', () => {
    const component = mount(
      <DependencyInjector value={dependencies}>
        <GoogleEmailButton
          emailAddress={''}
          isEditMode={true}
          updateEmailSettings={async () => {}}
        ></GoogleEmailButton>
      </DependencyInjector>
    );
    chai.expect(component).not.to.be.undefined;
    chai.expect(component.find('#removeButton').length).to.eq(0);
    chai.expect(component.find('#googleButton').length).to.be.greaterThan(0);
  });

  it('should render in edit mode when there is an email address', () => {
    const component = mount(
      <DependencyInjector value={dependencies}>
        <GoogleEmailButton
          emailAddress={'a@a.aa'}
          isEditMode={true}
          updateEmailSettings={async () => {}}
        ></GoogleEmailButton>
      </DependencyInjector>
    );
    chai.expect(component).not.to.be.undefined;
    chai.expect(component.find('#removeButton').length).to.eq(1);
    chai.expect(component.find('#googleButton').length).to.eq(0);
  });

  it('should call updateEmailSettings when verified', done => {
    const updateEmailSettings = async (e: EmailAccount) => {
      chai.expect(e.emailAddress).to.eq('test@gmail.com');
      chai.expect(e.refreshToken).to.eq('refreshToken');
      chai.expect(e.smtp).to.eq('smtp.gmail.com');
      chai.expect(e.isGoogle).to.eq(true);

      done();
    };

    const component = mount(
      <DependencyInjector value={dependencies}>
        <GoogleEmailButton
          emailAddress={''}
          isEditMode={true}
          updateEmailSettings={updateEmailSettings}
        ></GoogleEmailButton>
      </DependencyInjector>
    );

    component
      .find('#googleButton')
      .first()
      .simulate('click');
  });

  it('should call updateEmailSettings when clearing the selected account', done => {
    const updateEmailSettings = async (e: EmailAccount) => {
      chai.expect(e.emailAddress).to.eq('');
      chai.expect(e.refreshToken).to.be.undefined;
      chai.expect(e.isGoogle).to.eq(false);

      done();
    };

    const component = mount(
      <DependencyInjector value={dependencies}>
        <GoogleEmailButton
          emailAddress={'a@a.aa'}
          isEditMode={true}
          updateEmailSettings={updateEmailSettings}
        ></GoogleEmailButton>
      </DependencyInjector>
    );

    // Mocked mailer works on the third time by default
    component
      .find('#removeButton')
      .first()
      .simulate('click');
  });
});
