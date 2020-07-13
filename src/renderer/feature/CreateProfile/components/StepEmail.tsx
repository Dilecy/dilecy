import React from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { STEP_PROFILE, STEP_CONSENT } from '../profile-types';
import { localization as localizations } from '../../../shared/localization';
import { setProfileStepData, setProfileStep, abortProfile } from '../actions';
import { getProfileData } from '../selectors';
import { RootState } from 'typesafe-actions';
import { CreateProfileData } from '../../../store/stateModel';
import { useEmailForm } from '../ProfileHooks';
import StyledButton from '../../../shared/components/StyledButton';
import StyledButtonOutlined from '../../../shared/components/StyledButtonOutlined';
import { customTheme } from '../../../shared/styles/theme';
import { GoogleEmailButton } from '../../../shared/components/GoogleEmailButton';
import { EmailAccount } from '../../../model/clientModel';
import { pushAlert } from '../../../core/actions';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'flex-end',
    flex: '1',
    backgroundColor: 'white',
    padding: theme.spacing(customTheme.spacing),
    borderRadius: customTheme.borderRadius,
    position: 'relative'
  },
  form: { flex: '1', display: 'flex', flexDirection: 'column' },
  overlaySpinner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem'
  },
  textfield: {
    flexGrow: 1,
    minHeight: '5rem',
    maxWidth: 'calc(100% - 2rem)'
  },
  row: {
    display: 'flex',
    minHeight: '5rem',
    height: '5rem',
    width: '100%'
  },
  justifyContentCenter: {
    justifyContent: 'center'
  },
  googleRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '1.5rem'
  },
  card: {
    boxShadow: customTheme.shadow,
    borderRadius: customTheme.borderRadius,
    backgroundColor: 'white',
    padding: customTheme.cardPadding,
    flex: '1',
    overflow: 'auto',
    display: 'flex',
    '& > div': {
      marginBottom: '0.75rem'
    }
  },
  item: {
    paddingBottom: theme.spacing(2),
    display: 'flex',
    '& > :not(:last-child)': {
      marginRight: '2rem'
    }
  },
  button: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  },
  buttonBar: {
    paddingBottom: '0',
    marginTop: theme.spacing(customTheme.spacing),
    display: 'flex',
    justifyContent: 'space-between'
  },
  noEmailRow: {
    marginTop: '2rem'
  }
}));

const labels = {
  emailAddress: localizations.LABEL_EMAIL_ADDRESS,
  emailPassword: localizations.LABEL_EMAIL_PASSWORD,
  smtpUser: localizations.LABEL_SMTP_USER,
  smtp: localizations.LABEL_SMTP,
  smtpPort: localizations.LABEL_SMTP_PORT
};

interface Props {
  setProfileStepData: typeof setProfileStepData;
  setProfileStep: typeof setProfileStep;
  abortProfile: typeof abortProfile;
  pushAlert: typeof pushAlert;

  profileData: CreateProfileData;
}

const StepEmail = (props: Props) => {
  const classes = useStyles();
  const {
    emailAddress,
    emailPassword,
    smtp,
    smtpPort,
    smtpUser,
    isGoogle
  } = props.profileData;
  const { setProfileStepData, setProfileStep, abortProfile, pushAlert } = props;

  const {
    form,
    fieldProps,
    doAutoConfig,
    retryAutoConfig,
    loading
  } = useEmailForm({
    submitAction: async values => {
      setProfileStepData(values);
      setProfileStep({ stepName: STEP_CONSENT });
    },
    initialValues: {
      emailAddress: emailAddress || '',
      emailPassword: emailPassword || '',
      smtp: smtp || '',
      smtpPort: smtpPort || 0,
      smtpUser: smtpUser || '',
      isGoogle: isGoogle || false
    }
  });
  const textFieldProps = (id: keyof typeof labels) => ({
    label: labels[id],
    className: classes.textfield,
    ...fieldProps(id)
  });

  const handleGoogleEmail = async (event: EmailAccount) => {
    // Somewhat hacky, but the formik form retains the old
    // isGoogle value, even though it's rerendered
    form.setFieldValue('isGoogle', event.isGoogle);

    setProfileStepData({ ...event });
    if (event.emailAddress && event.refreshToken) {
      setProfileStep({ stepName: STEP_CONSENT });
    }
  };

  const shouldValidate = emailAddress || isGoogle || form.values.emailAddress;

  return (
    <React.Fragment>
      <form className={classes.form}>
        <Grid container className={classes.root + ' ' + classes.card}>
          {loading && (
            <div className={classes.overlaySpinner}>
              <CircularProgress />
            </div>
          )}
          <div style={{ margin: 'auto 0' }}>
            <Grid className={classes.googleRow} item xs={12}>
              <GoogleEmailButton
                updateEmailSettings={handleGoogleEmail}
                emailAddress={isGoogle ? emailAddress : ''}
                isEditMode={true}
                handleError={e => pushAlert(e)}
              ></GoogleEmailButton>
            </Grid>
            <Grid
              item
              className={classes.item + ' ' + classes.justifyContentCenter}
              style={{ paddingBottom: '0' }}
              xs={12}
            >
              <Typography>{localizations.OR}</Typography>
            </Grid>
            <div className={classes.row + ' ' + classes.justifyContentCenter}>
              <Grid item className={classes.item} xs={4}>
                <TextField
                  {...textFieldProps('emailAddress')}
                  placeholder={localizations.EMAIL_PLACEHOLDER}
                  disabled={isGoogle}
                  autoFocus
                />
              </Grid>
            </div>
            <div
              className={classes.row + ' ' + classes.justifyContentCenter}
              style={{ marginBottom: '1rem' }}
            >
              <Grid item className={classes.item} xs={4}>
                <TextField
                  type="password"
                  {...textFieldProps('emailPassword')}
                  disabled={isGoogle}
                />
              </Grid>
            </div>

            {!doAutoConfig && (
              <div>
                <div style={{ height: '6rem' }} className={classes.row}>
                  <Grid item className={classes.item} xs={4}>
                    <TextField
                      {...textFieldProps('smtpUser')}
                      placeholder="z.B. smtp.example.com"
                      disabled={isGoogle}
                    />
                  </Grid>
                  <Grid item className={classes.item} xs={4}>
                    <TextField
                      {...textFieldProps('smtp')}
                      placeholder="z.B. max@example.com"
                      disabled={isGoogle}
                    />
                  </Grid>
                  <Grid item className={classes.item} xs={4}>
                    <TextField
                      {...textFieldProps('smtpPort')}
                      type="number"
                      placeholder="z.B. 587"
                      disabled={isGoogle}
                    />
                  </Grid>
                </div>
                <Grid
                  item
                  xs={12}
                  style={{ marginBottom: '1rem', textAlign: 'center' }}
                >
                  {!doAutoConfig && (
                    <StyledButtonOutlined onClick={() => retryAutoConfig()}>
                      {localizations.RESET}
                    </StyledButtonOutlined>
                  )}
                </Grid>
              </div>
            )}
            {isGoogle ? (
              <Grid item className={classes.item} xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  {localizations.SMTP_DISABLED_GOOGLE_EXPLANATION}
                </Typography>
              </Grid>
            ) : null}
            <Typography variant="subtitle1">
              {localizations.EMAIL_CLIENT_EXPLANATION}
            </Typography>
          </div>
        </Grid>

        <div className={classes.buttonBar}>
          <StyledButtonOutlined
            onClick={() => setProfileStep({ stepName: STEP_PROFILE })}
          >
            {localizations.BACK}
          </StyledButtonOutlined>
          <StyledButtonOutlined onClick={abortProfile}>
            {localizations.CANCEL}
          </StyledButtonOutlined>

          <StyledButton
            type="submit"
            onClick={(event: React.FormEvent) => {
              event.preventDefault();
              if (shouldValidate) {
                form.submitForm();
              } else {
                setProfileStep({ stepName: STEP_CONSENT });
              }
            }}
            disabled={form.isSubmitting}
          >
            {shouldValidate
              ? localizations.NEXT
              : localizations.PROCEED_WITHOUT_EMAIL}
          </StyledButton>
        </div>
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
  abortProfile,
  pushAlert
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(StepEmail);
