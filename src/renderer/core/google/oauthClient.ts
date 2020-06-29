import ElectronGoogleOAuth2 from '@getstation/electron-google-oauth2';

export interface OAuthClient {
  setRefreshToken: (refreshToken: string | undefined) => void;
  getAccessToken: () => Promise<string | undefined | null>;
  openAuthWindowAndGetTokens: () => Promise<OAuthData>;
  requestEmail: (url: string) => Promise<string>;
  getAuthClient: (refreshToken: string | undefined) => any;
}

export interface OAuthData {
  refresh_token?: string | null;
  scope: string;
}

export const createOAuthClient = (
  clientId: string,
  clientSecret: string,
  apiScopes: string[],
  redirectUrl?: string
): OAuthClient => {
  const client = new ElectronGoogleOAuth2(clientId, clientSecret, apiScopes, {
    successRedirectURL: redirectUrl
  });
  return {
    setRefreshToken: refreshToken => {
      return client.setTokens({ refresh_token: refreshToken });
    },
    getAccessToken: async () => {
      const tokenResponse = await client.oauth2Client.getAccessToken();
      return tokenResponse.token;
    },
    openAuthWindowAndGetTokens: async () => {
      return (await client.openAuthWindowAndGetTokens()) as OAuthData;
    },
    requestEmail: async (url: string) => {
      const result = await client.oauth2Client.request({ url });
      return (result.data as any).email;
    },
    getAuthClient: refreshToken => {
      client.setTokens({ refresh_token: refreshToken });
      return client.oauth2Client;
    }
  };
};
