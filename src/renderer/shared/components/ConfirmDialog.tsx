import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { StyledButton, StyledButtonOutlined } from '@dilecy/shared';
import { customTheme } from '../styles/theme';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  handleCancel: () => void;
  handleOk: () => void;
  children?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiDialog-paper': {
      borderRadius: customTheme.borderRadius,
      overflow: 'hidden',
      padding: '0.75rem'
    }
  }
}));

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  handleCancel,
  handleOk,
  title,
  children
}) => {
  const classes = useStyles();
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="sm"
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      className={classes.root}
    >
      <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <StyledButtonOutlined autoFocus fullWidth onClick={handleCancel}>
          Nein
        </StyledButtonOutlined>
        <StyledButton onClick={handleOk} fullWidth>
          Ja
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};
