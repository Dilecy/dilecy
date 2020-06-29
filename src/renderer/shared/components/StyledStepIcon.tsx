import React from 'react';
import clsx from 'clsx';

import { makeStyles, Theme } from '@material-ui/core/styles';

interface StepIconProps {
  active: boolean;
  completed: boolean;
  icon: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  circle: {
    width: '2rem',
    height: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[300],
    color: 'white',
    borderRadius: '9999rem'
  },
  completed: {
    width: '2rem',
    height: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: `inset 0px 0px 0px 2px ${theme.palette.primary.main}`,
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    borderRadius: '9999rem',
    cursor: 'pointer'
  }
}));
export default function CustomStepIcon(props: StepIconProps) {
  const classes = useStyles();
  const { completed, icon } = props;
  return (
    <div className={clsx(classes.root, {})}>
      <div
        className={clsx(classes.circle, {
          [classes.completed]: completed
        })}
      >
        {icon}
      </div>
    </div>
  );
}
