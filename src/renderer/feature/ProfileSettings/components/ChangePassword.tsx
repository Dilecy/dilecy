import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Formik, Form } from 'formik';
import { SealedPassword } from '../../../core/crypto/interface';
import { usePasswordSealer } from '../../../core/dependencies';
import { ChangePasswordValidationSchema } from '../../../shared/utils/validationSchema';
import { CustomInputField } from '../../../shared/components/CustomInputField';
import StyledButton from '../../../shared/components/StyledButton';
import StyledButtonOutlined from '../../../shared/components/StyledButtonOutlined';
import { customTheme } from '../../../shared/styles/theme';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiPaper-root': {
        borderRadius: customTheme.borderRadius
      },
      '& .MuiTextField-root': {
        width: '100%'
      }
    }
  })
);

interface Props {
  open: boolean;
  setOpenChangePassword: (event: boolean) => void;
  savedPasswordHash: string;
  updatePassword: (event: {
    oldPassword: SealedPassword;
    newPassword: SealedPassword;
  }) => void;
}

interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePassword: React.FC<Props> = ({
  open,
  setOpenChangePassword,
  updatePassword,
  savedPasswordHash
}) => {
  const handleClose = () => {
    setOpenChangePassword(false);
  };

  const classes = useStyles();

  const changePassword: ChangePassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const sealPassword = usePasswordSealer();

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      className={classes.root}
    >
      <DialogTitle id="simple-dialog-title">Profilpasswort ändern</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={changePassword}
          onSubmit={async (values, { setFieldError, setSubmitting }) => {
            const newSealedPassword = sealPassword(values.newPassword);
            const oldSealedPassword = sealPassword(values.currentPassword);

            if (oldSealedPassword.matchesHash(savedPasswordHash)) {
              setSubmitting(false);
              updatePassword({
                oldPassword: oldSealedPassword,
                newPassword: newSealedPassword
              });
              setOpenChangePassword(false);
            } else {
              setSubmitting(false);
              setFieldError('currentPassword', 'Incorrect Password Entered');
            }
          }}
          validationSchema={ChangePasswordValidationSchema}
        >
          {({ dirty }) => (
            <Form autoComplete="off">
              <CustomInputField
                type="password"
                name="currentPassword"
                placeholder="Aktuelles Passwort"
              />
              <CustomInputField
                type="password"
                name="newPassword"
                placeholder="Neues Passwort"
              />
              <CustomInputField
                type="password"
                name="confirmPassword"
                placeholder="Passwort bestätigen"
              />
              <DialogActions>
                <StyledButtonOutlined onClick={handleClose}>
                  Abbrechen
                </StyledButtonOutlined>
                <StyledButton type="submit" disabled={!dirty}>
                  Passwort ändern
                </StyledButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
