import React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { STEP_EMAIL } from '../profile-types';
import { localization } from '@dilecy/shared';
import { setProfileStepData, setProfileStep, abortProfile } from '../actions';
import { getProfileData } from '../selectors';
import { RootState } from 'typesafe-actions';
import { CreateProfileData } from '@dilecy/store/stateModel';
import { useProfileDataForm } from '../ProfileHooks';
import { StyledButton, StyledButtonOutlined } from '@dilecy/shared';
import { customTheme } from '@dilecy/shared/styles/theme';

const useStyles = makeStyles(theme => ({
  root: {
    flex: '1',
    boxShadow: customTheme.shadow,
    borderRadius: customTheme.borderRadius,
    padding: theme.spacing(customTheme.spacing)
  },
  form: { flex: '1', display: 'flex', flexDirection: 'column' },
  textfield: {
    margin: theme.spacing(1),
    minHeight: '5.625rem',
    flexGrow: 1
  },
  card: {
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    padding: customTheme.cardPadding,
    backgroundColor: 'white',
    flex: '1',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  item: {
    paddingBottom: theme.spacing(2),
    display: 'flex'
  },
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  },
  buttonBar: {
    display: 'flex',
    marginTop: theme.spacing(customTheme.spacing),
    justifyContent: 'space-between'
  },
  fieldset: {
    display: 'flex',
    width: '100%'
  },
  warning: {
    color: '#f44336'
  }
}));

const labels = {
  profileName: localization.LABEL_PROFILE_NAME,
  password: localization.LABEL_PASSWORD,
  password2: localization.LABEL_PASSWORD_AGAIN
};

interface Props {
  setProfileStepData: typeof setProfileStepData;
  setProfileStep: typeof setProfileStep;
  profileData: CreateProfileData;
  abortProfile: typeof abortProfile;
}

const StepProfile = (props: Props) => {
  const classes = useStyles();
  const { profileName, password, password2 } = props.profileData;
  const { setProfileStepData, setProfileStep, abortProfile } = props;

  const { form, fieldProps } = useProfileDataForm({
    submitAction: async values => {
      setProfileStepData(values);
      setProfileStep({ stepName: STEP_EMAIL });
    },
    initialValues: {
      profileName: profileName || '',
      password: password || '',
      password2: password2 || ''
    }
  });

  const textFieldProps = (id: keyof typeof labels) => ({
    label: labels[id],
    className: classes.textfield,
    ...fieldProps(id)
  });

  return (
    <React.Fragment>
      <form className={classes.form}>
        <Grid container className={classes.root + ' ' + classes.card}>
          <div className={classes.fieldset}>
            <Grid item className={classes.item} xs={4}>
              <TextField {...textFieldProps('profileName')} autoFocus />
            </Grid>
            <Grid item className={classes.item} xs={4}>
              <TextField type="password" {...textFieldProps('password')} />
            </Grid>
            <Grid item className={classes.item} xs={4}>
              <TextField type="password" {...textFieldProps('password2')} />
            </Grid>
          </div>

          <div>
            <Typography variant="subtitle1" gutterBottom>
              {localization.PROFILE_DESCRIPTION}
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              className={classes.warning}
            >
              {localization.PROFILE_DESCRIPTION_WARNING}
            </Typography>
          </div>
        </Grid>

        <Grid container>
          <Grid item xs={12} className={classes.buttonBar}>
            <StyledButtonOutlined style={{ visibility: 'hidden' }}>
              {localization.BACK}
            </StyledButtonOutlined>
            <StyledButtonOutlined onClick={abortProfile}>
              {localization.CANCEL}
            </StyledButtonOutlined>
            <StyledButton
              type="submit"
              onClick={(event: React.FormEvent) => {
                event.preventDefault();
                form.submitForm();
              }}
              disabled={form.isSubmitting}
            >
              {localization.NEXT}
            </StyledButton>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => ({
  profileData: getProfileData(state)
});

const dispatchToProps = {
  setProfileStepData,
  setProfileStep,
  abortProfile
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(StepProfile);
