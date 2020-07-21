/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Form, Formik } from 'formik';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { useDispatch } from 'react-redux';
import { MissingBrandValidationSchema } from '@dilecy/shared/utils/validationSchema';
import { CustomInputField } from '@dilecy/shared/components/CustomInputField';
import { addMissingBrand } from '../actions';
import { customTheme } from '@dilecy/shared/styles/theme';
import { StyledButton, StyledButtonOutlined } from '@dilecy/shared';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(customTheme.spacing),

      '& .MuiDialog-paper': {
        borderRadius: customTheme.borderRadius,
        overflow: 'hidden',
        padding: '0.75rem'
      },
      marginBottom: theme.spacing(customTheme.spacing),
      '& .MuiTextField-root': {
        width: '100%'
      }
    }
  })
);
interface Props {
  open: boolean;
  setOpenSuggestBrand: (event: boolean) => void;
}
export interface MissingBrand {
  name: string;
  company_name: string;
  website_url: string;
  data_protection_officer_email: string;
  address_1: string;
  address_2: string;
  zip_code: string;
  city: string;
}

const missingBrandState: MissingBrand = {
  name: '',
  company_name: '',
  website_url: '',
  data_protection_officer_email: '',
  address_1: '',
  address_2: '',
  zip_code: '',
  city: ''
};

export const SuggestBrand: React.FC<Props> = ({
  open,
  setOpenSuggestBrand
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpenSuggestBrand(false);
  };
  return (
    <Dialog
      aria-labelledby="suggest-missing-brand"
      open={open}
      onClose={handleClose}
      className={classes.root}
    >
      <DialogTitle id="simple-dialog-title">
        Unternehmen Vorschlagen
      </DialogTitle>
      <DialogContent>
        <Typography>
          Dir fehlt ein Unternehmen in unserer Datenbank? Hilf uns es
          aufzunehmen
        </Typography>
        <Formik
          initialValues={missingBrandState}
          validationSchema={MissingBrandValidationSchema}
          onSubmit={formData => {
            dispatch(addMissingBrand(formData));
            setOpenSuggestBrand(false);
          }}
        >
          {({ isValid }) => (
            <Form autoComplete="off">
              <CustomInputField
                type="text"
                name="name"
                placeholder="Name"
                autoFocus
              />
              <CustomInputField
                type="text"
                name="company_name"
                placeholder="Mutterunternehmen"
              />
              <CustomInputField
                type="text"
                name="website_url"
                placeholder="Webseite"
              />
              <CustomInputField
                type="text"
                name="data_protection_officer_email"
                placeholder="Email"
              />
              <CustomInputField
                type="text"
                name="address_1"
                placeholder="Straße/Nr"
              />
              <CustomInputField
                type="text"
                name="zip_code"
                placeholder="Postcode"
              />
              <CustomInputField type="text" name="city" placeholder="City" />
              <DialogActions>
                <StyledButtonOutlined fullWidth onClick={handleClose}>
                  Abbrechen
                </StyledButtonOutlined>
                <StyledButton type="submit" fullWidth disabled={!isValid}>
                  Vorschlagen
                </StyledButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
