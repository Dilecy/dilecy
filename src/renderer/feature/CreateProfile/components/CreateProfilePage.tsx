import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { STEP_PROFILE, STEP_EMAIL, STEP_CONSENT } from '../profile-types';
import CustomStepper from './CustomStepper';
import { localization } from '@dilecy/shared';
import { getActiveStep } from '../selectors';
import StepConsent from './StepConsent';
import StepEmail from './StepEmail';
import StepProfile from './StepProfile';
import { customTheme } from '@dilecy/shared/styles/theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '96.375rem'
    },
    backButton: {
      marginRight: theme.spacing(1)
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    heading: {
      fontSize: customTheme.fontSizeH1,
      fontWeight: 'bold',
      margin: 0,
      padding: '0.625rem'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      marginBottom: theme.spacing(customTheme.spacing),
      borderRadius: '9999rem',
      backgroundColor: 'white',
      height: '3.5rem',
      maxHeight: '3.5rem',

      '& > div': {
        flex: '1'
      }
    }
  })
);

const getSteps = () => [STEP_PROFILE, STEP_EMAIL, STEP_CONSENT];

const getStepContent = (stepIndex: string | undefined) => {
  switch (stepIndex) {
    case STEP_PROFILE:
      return <StepProfile />;
    case STEP_EMAIL:
      return <StepEmail />;
    case STEP_CONSENT:
      return <StepConsent />;
    default:
      return <StepProfile />;
  }
};

interface Props {
  activeStep: string;
}

const CreateProfileForm: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const steps = getSteps();

  const { activeStep } = props;

  return (
    <div className={classes.root}>
      <div className={classes.nav}>
        <h1 className={classes.heading}>{localization.CREATE_PROFILE}</h1>
        <CustomStepper width={'25rem'} steps={steps} active={activeStep} />
      </div>
      {getStepContent(activeStep)}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeStep: getActiveStep(state)
});

const dispatchToProps = {};

export default connect(
  mapStateToProps,
  dispatchToProps
)(CreateProfileForm);
