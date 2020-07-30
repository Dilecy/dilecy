import { GoogleAuth, GoogleAuthResult } from './interface';

export function createGoogleAuthMock(): GoogleAuth {
  return {
    getUserData: async (refreshToken?: string): Promise<GoogleAuthResult> => {
      return Promise.resolve({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        email: 'test@gmail.com'
      });
    },
    reset: () => {},
    getApiClient: async (refreshToken?: string) => {
      return {};
    }
  };
}
