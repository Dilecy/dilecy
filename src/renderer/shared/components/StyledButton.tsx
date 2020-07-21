import React from 'react';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { customTheme } from '../styles/theme';

export interface ButtonProps {
  classes: { [key: string]: string };
  children?: React.ReactNode;
  className?: string;
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | undefined;
  [key: string]: any;
}

const styles = createStyles((theme: Theme) => ({
  root: {
    borderRadius: '99999rem',
    padding: '0.5rem 1rem',
    lineHeight: 1.25,
    fontSize: customTheme.fontSizeBodyLarge,
    fontFamily: 'Montserrat SemiBold',
    boxShadow: customTheme.shadow,
    maxHeight: '3rem'
  }
}));

function _component(props: ButtonProps) {
  const { classes, children, className, color, ...others } = props;
  return (
    <Button
      className={classes.root + ' ' + className}
      variant="contained"
      color={color || 'primary'}
      {...others}
    >
      {children}
    </Button>
  );
}

const StyledButton = withStyles(styles)(_component);

export { StyledButton };
