import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { EmailAccount } from '../../model/clientModel';
import { useGoogleAuth } from '../../core/dependencies';
import StyledButtonOutlined from '../../shared/components/StyledButtonOutlined';
import { customTheme } from '../../shared/styles/theme';
import { localization } from '../localization';
import { GoogleIcon } from './Icon';

const useStyles = makeStyles((theme: Theme) => ({
  setEmail: {
    marginBottom: '1rem'
  },
  icon: {
    marginRight: ' 0.5rem',
    height: '1.5rem',
    '& .MuiSvgIcon-root': {
      width: '1.5rem',
      height: '1.5rem'
    }
  },
  removeEmail: {
    width: '1.75rem',
    height: '1.75rem',
    margin: 0,
    padding: 0,
    backgroundColor: '#334395',
    borderRadius: '9999rem',
    marginRight: 10,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 1.25,
    fontSize: customTheme.fontSizeBodyLarge,
    marginTop: 3,
    transition: 'ease-out .2s',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',

    '&:hover, &:focus': {
      backgroundColor: '#fff',
      color: '#334395',
      cursor: 'pointer'
    }
  }
}));

interface Props {
  emailAddress: string | undefined;
  updateEmailSettings: (event: EmailAccount) => Promise<void>;
  handleError?: (err: string) => void;
  isEditMode: boolean;
}

export const GoogleEmailButton: React.FC<Props> = ({
  emailAddress,
  updateEmailSettings,
  isEditMode,
  handleError
}) => {
  const googleAuth = useGoogleAuth();
  const classes = useStyles();

  const handleGoogleClick = async () => {
    try {
      const { refreshToken, email } = await googleAuth.getUserData();

      const emailSettingsToUpdate: EmailAccount = {
        emailAddress: email!,
        isPrimary: true,
        isGoogle: true,
        refreshToken,
        smtp: 'smtp.gmail.com',
        smtpPort: 465,
        smtpUser: '',
        encyptedPassword: ''
      };

      await updateEmailSettings(emailSettingsToUpdate);
    } catch (err) {
      if (handleError) {
        handleError(localization.GOOGLE_AUTH_ERROR);
      }
    }
  };

  const handleRemoveClick = async () => {
    // Clear the stored access token, if any
    googleAuth.reset();
    const settingsToUpdate: EmailAccount = {
      emailAddress: '',
      isGoogle: false,
      refreshToken: undefined,
      smtp: '',
      smtpPort: 0,
      isPrimary: true,
      smtpUser: '',
      encyptedPassword: ''
    };
    await updateEmailSettings(settingsToUpdate);
  };

  return (
    <>
      {emailAddress ? (
        <Grid container style={{ width: 'unset' }}>
          <Grid item xs={12}>
            <Typography variant="caption">{localization.EMAIL}</Typography>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.setEmail}>
              {isEditMode && (
                <div
                  id="removeButton"
                  className={classes.removeEmail}
                  onClick={handleRemoveClick}
                >
                  &times;
                </div>
              )}
              <Typography style={{ display: 'inline' }}>
                {emailAddress}
              </Typography>
            </div>
          </Grid>
        </Grid>
      ) : (
        isEditMode && (
          <StyledButtonOutlined
            onClick={handleGoogleClick}
            variant="outlined"
            color="primary"
            id="googleButton"
          >
            <div className={classes.icon}>
              <GoogleIcon />
            </div>
            {localization.SIGN_UP_WITH_GOOGLE}
          </StyledButtonOutlined>
        )
      )}
    </>
  );
};
