// eslint-disable-next-line @typescript-eslint/camelcase
import { gmail_v1 } from 'googleapis/build/src/apis/gmail/v1';
import { GoogleAuth, GoogleAuthResult } from './interface';
import { createOAuthClient, OAuthClient } from './oauthClient';
import {
  DILECY_OAUTH_REDIRECT,
  GOOGLE_API_SCOPE,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_PROFILE_URL
} from '../../shared/utils/environment';

let lastToken: GoogleAuthResult = {};

async function getUser(client: OAuthClient) {
  const tokens = await client.openAuthWindowAndGetTokens();

  // Check if user granted the email scope
  const grantedScopes = tokens.scope.split(' ');
  if (grantedScopes.indexOf(GOOGLE_API_SCOPE) === -1) {
    return Promise.reject('Insufficient scope');
  }

  const email = await client.requestEmail(GOOGLE_PROFILE_URL);

  return {
    refreshToken: tokens.refresh_token!,
    email
  };
}

export const googleAuth: GoogleAuth = {
  getUserData: async (refreshToken?: string): Promise<GoogleAuthResult> => {
    if (lastToken.accessToken) {
      return Promise.resolve(lastToken);
    }
    const client = createOAuthClient(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET!,
      [GOOGLE_API_SCOPE],
      DILECY_OAUTH_REDIRECT
    );

    if (refreshToken) {
      try {
        client.setRefreshToken(refreshToken!);
        const accessToken = await client.getAccessToken();

        lastToken = {
          accessToken: accessToken!,
          refreshToken
        };
        return lastToken;
      } catch (e) {
        client.setRefreshToken(undefined);
        const result = await getUser(client);
        lastToken = result;
        return result;
      }
    } else {
      const result = await getUser(client);
      lastToken = result;

      return result;
    }
  },
  getApiClient: async (refreshToken: string) => {
    const client = createOAuthClient(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET!,
      [GOOGLE_API_SCOPE],
      DILECY_OAUTH_REDIRECT
    );

    const auth = await client.getAuthClient(refreshToken);

    // eslint-disable-next-line @typescript-eslint/camelcase
    return new gmail_v1.Gmail({ auth });
  },
  reset() {
    lastToken = {};
  }
};
