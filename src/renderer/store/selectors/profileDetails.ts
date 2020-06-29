import { RootState } from 'typesafe-actions';

export const getLoggedIn = (state: RootState) => {
  const loggedIn = state.loginStatus.loggedIn;
  if (!loggedIn) throw new Error('Internal Error');
  return loggedIn;
};

export const getPrimaryEmail = (state: RootState) => {
  let email: string | undefined = undefined;
  if (state.loginStatus.loggedIn) {
    const { emailAccounts } = state.loginStatus.loggedIn.profileDetails;
    const primary = emailAccounts.find(e => e.isPrimary);
    email = primary && primary.emailAddress;
  }
  if (!email) throw new Error('Internal Error');
  return email;
};
