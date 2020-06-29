import { createContext, useContext } from 'react';
import { ClientBackend } from '../model/clientModel';
import { BrowserHistory } from 'node-browser-history';
import { PasswordSealer, RandomGenerator } from './crypto/interface';
import { LoginSystem } from '../feature/Login/login';
import { Mailer } from './mailer/interface';
import { Tracker } from './tracker/interface';
import { ApiService } from './api/api-interface';
import { GoogleAuth } from './google/interface';

export interface Dependencies {
  sealPassword: PasswordSealer;
  rng: RandomGenerator;
  loginSystem: LoginSystem;
  clientBackend: ClientBackend;
  apiService: ApiService;
  mailer: Mailer;
  tracker: Tracker;
  browserHistory: (timeInMins: number) => Promise<BrowserHistory[]>;
  googleAuth: GoogleAuth;
}

const DepsContext = createContext<Dependencies | null>(null);
export const DependencyInjector = DepsContext.Provider;

const useDeps = () => {
  const deps = useContext(DepsContext);
  if (!deps) throw new Error('No Dependencies injected.');
  return deps;
};

export const useSealedProfilePassword = () => {
  const { loginSystem } = useDeps();
  return loginSystem.sealedPassword;
};

export const usePasswordSealer = () => {
  const { sealPassword } = useDeps();
  return sealPassword;
};

export const useMailer = () => {
  const { mailer } = useDeps();
  return mailer;
};

export const useTracker = () => {
  const { tracker } = useDeps();
  return tracker;
};

export const useVisitorIdGenerator = () => {
  const { rng } = useDeps();
  return rng.generateVisitorId;
};

export const useGoogleAuth = () => {
  const { googleAuth } = useDeps();
  return googleAuth;
};
