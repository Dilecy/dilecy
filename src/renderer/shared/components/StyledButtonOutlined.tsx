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
    // In order to achieve a border without making the button bigger in size
    // we set border to 0 and emulate a border by using an inset shadow.
    border: 'none',
    boxShadow: `inset 0px 0px 0px 0.125rem ${theme.palette.primary.main},
                0px 0.125rem 0.375rem #00000029`,
    lineHeight: 1.25,
    borderColor: theme.palette.primary.main,
    fontFamily: 'Montserrat SemiBold',
    fontSize: customTheme.fontSizeBodyLarge,
    backgroundColor: 'white',
    maxHeight: '3rem',

    '&:hover': {
      border: 'none',
      boxShadow: `inset 0px 0px 0px 0.125rem ${theme.palette.primary.main},
                  0px 0.125rem 0.375rem #00000029`
    }
  }
}));

function StyledButtonOutlined(props: ButtonProps) {
  const { classes, children, color, className, ...others } = props;
  return (
    <Button
      className={classes.root + ' ' + className}
      variant="outlined"
      color={color || 'primary'}
      {...others}
    >
      {children}
    </Button>
  );
}

export default withStyles(styles)(StyledButtonOutlined);
