import React from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { customTheme } from '../styles/theme';
import { localization as localizations } from '../localization';
import StyledButton from './StyledButton';
import StyledButtonOutlined from './StyledButtonOutlined';
import { CardContent, Typography } from '@material-ui/core';
import { CustomInputField } from './CustomInputField';
import { Formik, Form, FormikHelpers } from 'formik';
import { ForwardEmailSettingsValidationSchema } from '../utils/validationSchema';
import {
  EmailForwardFormValues,
  defaultEmailForwardFormValues
} from '../../feature/CreateProfile/ProfileHooks';
import { EmailAccount } from '../../model/clientModel';

interface EmailForwarderDialogProps {
  close: () => void;
  back: () => void;
  confirm: (emailAddress: EmailAccount) => Promise<any>;
}

const useStylesEmailForwarderDialog = makeStyles((theme: Theme) => ({
  card: { maxWidth: '80%' },
  welcomeMessage: {
    padding: '2rem',
    textAlign: 'center',
    minHeight: '10rem',
    borderRadius: customTheme.borderRadius,
    overflow: 'hidden',
    '& h4': {
      fontSize: '1.5rem',
      paddingBottom: '1rem'
    }
  },
  titleRow: {
    marginBottom: '4rem'
  },
  formRow: {
    marginBottom: '4rem'
  },
  buttonRow: {
    'MuiButton-root': {
      width: 400
    }
  }
}));

const EmailForwarderDialog: React.FC<EmailForwarderDialogProps> = (
  props: EmailForwarderDialogProps
) => {
  const classes = useStylesEmailForwarderDialog();

  const { close, back, confirm } = props;

  const formikSubmit = async (data: EmailForwardFormValues) => {
    const { emailAddress } = data;
    confirm({
      emailAddress,
      isPrimary: true,
      isGoogle: false,
      smtp: '',
      smtpPort: 465,
      smtpUser: '',
      encyptedPassword: '',
      isForwarder: true
    });
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.welcomeMessage}>
        <Formik
          initialValues={defaultEmailForwardFormValues}
          validationSchema={ForwardEmailSettingsValidationSchema}
          onSubmit={formikSubmit}
        >
          {({ dirty }) => (
            <Form autoComplete="off">
              <div className={classes.titleRow}>
                <Typography variant="h4">{localizations.USE_DILECY}</Typography>
                <Typography variant="subtitle2">
                  {localizations.USE_DILECY_TIP}
                </Typography>
              </div>
              <div className={classes.formRow}>
                <Typography variant="subtitle2">
                  {localizations.EMAIL_FORWARD_QUESTION}
                </Typography>
                <CustomInputField
                  placeholder={localizations.YOUR_EMAIL_ADDRESS}
                  autoFocus
                  name="emailAddress"
                  type="email"
                />
              </div>
              <div className={classes.buttonRow}>
                <StyledButtonOutlined
                  style={{ width: 250, marginRight: 20 }}
                  onClick={() => back()}
                >
                  {localizations.BACK}
                </StyledButtonOutlined>
                <StyledButtonOutlined
                  style={{ width: 250, marginRight: 20 }}
                  onClick={() => close()}
                >
                  {localizations.CANCEL}
                </StyledButtonOutlined>
                <StyledButton type="submit" style={{ width: 250 }}>
                  {localizations.CONFIRM_AND_SEND}
                </StyledButton>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default EmailForwarderDialog;
