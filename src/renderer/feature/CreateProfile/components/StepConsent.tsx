/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { STEP_EMAIL } from '../profile-types';
import { Consent } from './Consent';
import { localization } from '@dilecy/shared';
import {
  setProfileStepData,
  setProfileStep,
  abortProfile,
  submitProfile
} from '../actions';

import { StyledButton, StyledButtonOutlined } from '@dilecy/shared';
import { customTheme } from '@dilecy/shared/styles/theme';
import { getProfileData } from '../selectors';
import { RootState } from 'typesafe-actions';
import { CreateProfileData } from '@dilecy/store/stateModel';

const useStyles = makeStyles(theme => ({
  root: {
    flex: '1',
    boxShadow: customTheme.shadow,
    borderRadius: customTheme.borderRadius,
    padding: theme.spacing(customTheme.spacing)
  },
  form: { flex: '1', display: 'flex', flexDirection: 'column' },
  card: {
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    padding: customTheme.cardPadding,
    backgroundColor: 'white',
    flex: '1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto'
  },
  buttonBar: {
    display: 'flex',
    marginTop: theme.spacing(customTheme.spacing),
    justifyContent: 'space-between'
  },
  item: {
    paddingBottom: theme.spacing(2),
    display: 'flex'
  },
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  }
}));

interface Props {
  setProfileStepData: typeof setProfileStepData;
  setProfileStep: typeof setProfileStep;
  abortProfile: typeof abortProfile;
  submitProfile: typeof submitProfile;
  profileState: CreateProfileData;
}

const StepConsent = (props: Props) => {
  const classes = useStyles();
  const {
    setProfileStepData,
    setProfileStep,
    abortProfile,
    submitProfile,
    profileState
  } = props;
  const { tracking, ux_research, accept_terms } = profileState;
  const consentState = {
    tracking: tracking || false,
    ux_research: ux_research || false,
    accept_terms: accept_terms || false
  };

  const handleConsentChange = (consent: {
    tracking: boolean;
    ux_research: boolean;
    accept_terms: boolean;
  }) => {
    setProfileStepData(consent);
  };

  const handleSubmit = () => {
    // Submit form on the final step
    submitProfile();
  };

  return (
    <React.Fragment>
      <form className={classes.form}>
        <Grid container className={classes.root + ' ' + classes.card}>
          <Grid item className={classes.item} xs={12}>
            <Consent
              onConsentChange={handleConsentChange}
              consentState={consentState}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {localization.MISSION}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item className={classes.buttonBar} xs={12}>
            <StyledButtonOutlined
              onClick={() => setProfileStep({ stepName: STEP_EMAIL })}
            >
              {localization.BACK}
            </StyledButtonOutlined>
            <StyledButtonOutlined onClick={abortProfile}>
              {localization.CANCEL}
            </StyledButtonOutlined>
            <StyledButton
              type="submit"
              disabled={!accept_terms}
              onClick={(event: React.FormEvent) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              {localization.CREATE_AND_SIGNUP}
            </StyledButton>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => ({
  profileState: getProfileData(state)
});

const dispatchToProps = {
  setProfileStepData,
  setProfileStep,
  abortProfile,
  submitProfile
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(StepConsent);
