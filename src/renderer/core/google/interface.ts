export interface GoogleAuthResult {
  accessToken?: string;
  refreshToken?: string;
  email?: string;
}

export interface GoogleAuth {
  getUserData: (refreshToken?: string) => Promise<GoogleAuthResult>;
  reset: () => void;
  getApiClient: (refreshToken: string) => any;
}
