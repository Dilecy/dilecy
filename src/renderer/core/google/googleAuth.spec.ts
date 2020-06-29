import chai from 'chai';
import { googleAuth } from './googleAuth';
import * as client from './oauthClient';
import { GOOGLE_API_SCOPE } from '../../shared/utils/environment';
chai.use(require('chai-spies'));
chai.should();

describe('Google Auth tests', () => {
  it('should return the access_token in the refresh token happy case', async () => {
    chai.spy.on(client, 'createOAuthClient', () => ({
      setRefreshToken: (token: string) => {},
      getAccessToken: async () => {
        return Promise.resolve('access_token');
      }
    }));

    const result = await googleAuth.getUserData('refreshToken');
    chai.expect(result.accessToken).to.eq('access_token');
    chai.expect(result.refreshToken).to.eq('refreshToken');
  });

  it('should retry the auth flow if the refresh token fails', async () => {
    chai.spy.on(client, 'createOAuthClient', () => ({
      setRefreshToken: (token: string) => {},
      getAccessToken: async () => {
        return Promise.reject();
      },
      openAuthWindowAndGetTokens: async () => {
        return Promise.resolve({
          refresh_token: 'refresh_token',
          scope: GOOGLE_API_SCOPE
        });
      },
      requestEmail: async (url: string) => {
        return Promise.resolve('a@a.aa');
      }
    }));

    const result = await googleAuth.getUserData('refreshToken');
    chai.expect(result.email).to.eq('a@a.aa');
    chai.expect(result.refreshToken).to.eq('refresh_token');
  });

  it('should gather login data when there is no refresh token', async () => {
    chai.spy.on(client, 'createOAuthClient', () => ({
      setRefreshToken: (token: string) => {},
      openAuthWindowAndGetTokens: async () => {
        return Promise.resolve({
          refresh_token: 'refresh_token',
          scope: GOOGLE_API_SCOPE
        });
      },
      requestEmail: async (url: string) => {
        return Promise.resolve('b@b.bb');
      }
    }));

    const result = await googleAuth.getUserData();
    chai.expect(result.email).to.eq('b@b.bb');
    chai.expect(result.refreshToken).to.eq('refresh_token');
  });

  afterEach(() => {
    chai.spy.restore(client, 'createOAuthClient');
    googleAuth.reset();
  });
});
