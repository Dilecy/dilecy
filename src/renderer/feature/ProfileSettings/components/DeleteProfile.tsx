import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import { customTheme } from '@dilecy/shared/styles/theme';
import { StyledButton, StyledButtonOutlined } from '@dilecy/shared';

interface Props {
  open: boolean;
  onCancelClicked: () => void;
  onDeleteClicked: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiDialogActions-root': {
      padding: '1rem'
    },
    '& .MuiDialog-paper': {
      borderRadius: customTheme.borderRadius,
      overflow: 'hidden'
    }
  }
}));

export const DeleteProfile: React.FC<Props> = ({
  open,
  onCancelClicked,
  onDeleteClicked
}) => {
  const classes = useStyles();
  return (
    <Dialog
      onClose={onCancelClicked}
      aria-labelledby="simple-dialog-title"
      open={open}
      className={classes.root}
    >
      <DialogTitle id="simple-dialog-title">Profil löschen</DialogTitle>
      <DialogContent>
        <Typography>
          Möchtest du dein Profil löschen? Dies kann nicht rückgängig gemacht
          werden.
        </Typography>
      </DialogContent>
      <DialogActions>
        <StyledButton color={'secondary'} onClick={onDeleteClicked}>
          Ja
        </StyledButton>
        <StyledButtonOutlined onClick={onCancelClicked}>
          Abbrechen
        </StyledButtonOutlined>
      </DialogActions>
    </Dialog>
  );
};
