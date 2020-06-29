import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      padding: theme.spacing(0.5)
    }
  })
);

interface Props {
  open: boolean;
  handleClose: () => void;
  message: string;
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}
export const CustomAlert: React.FC<Props> = ({
  open,
  handleClose,
  message,
  vertical,
  horizontal
}) => {
  const classes = useStyles();
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};
