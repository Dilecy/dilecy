import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import CustomStepIcon from '../../../shared/components/StyledStepIcon';
import { customTheme } from '../../../shared/styles/theme';

interface Props {
  active: string;
  steps: string[];
  width: string;
}

const useStyles = makeStyles(theme =>
  createStyles({
    stepper: {
      justifyContent: 'flex-end',
      padding: '0',

      '& .MuiStepConnector-lineHorizontal': {
        borderTopWidth: '2px'
      },

      '& .MuiStepLabel-iconContainer': {
        paddingRight: '0'
      },
      '& .MuiStepLabel-label': {
        textAlign: 'center'
      },
      '& .MuiStepConnector-line': {
        borderColor: theme.palette.primary.main
      },
      '& .MuiStepIcon-text': {
        fontSize: `${customTheme.fontSizeBodyLarge} !important`
      },
      '& .MuiStepConnector-root': {
        maxWidth: 80
      },
      [theme.breakpoints.down('lg')]: {
        '& .MuiStepConnector-root': {
          display: 'none'
        }
      },
      [theme.breakpoints.up('lg')]: {
        '& .MuiStepConnector-root': {
          display: 'block'
        }
      }
    },
    active: {
      backgroundColor: '#3f51b5'
    }
  })
);

const CustomStepper = (props: Props) => {
  const { active, steps, width } = props;
  const classes = useStyles();
  return (
    <div style={{ width: width || '100%' }}>
      <Stepper activeStep={steps.indexOf(active)} className={classes.stepper}>
        {steps.map(step => (
          <Step
            key={step}
            className={active === step ? 'active' : undefined}
            // This condition needs better handling
            completed={steps.indexOf(active) >= steps.indexOf(step)}
          >
            <StepLabel StepIconComponent={CustomStepIcon}></StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default CustomStepper;
