import React, { useState, useEffect } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { EmailAccount } from '@dilecy/model/clientModel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useMailer, useSealedProfilePassword } from '@dilecy/core/dependencies';
import { EmailFormValues } from '../../CreateProfile/ProfileHooks';
import { autoConfig } from '@dilecy/core/mailer/smtpConfig';
import {
  StyledButton,
  StyledButtonOutlined,
  GoogleEmailButton,
  localization,
  CustomInputField,
  EmailSettingsValidationSchema
} from '@dilecy/shared';

interface Props {
  emailSettings?: EmailAccount;
  showEditEmail: boolean;
  updateEmailSettings: (event: EmailAccount) => Promise<void>;
  toggleEditEmailSettings: (event: boolean) => Promise<void>;

  dialogMode?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '1rem auto',
      '& .MuiTextField-root': {
        width: '100%'
      }
    },
    saveButton: {
      margin: '1rem auto'
    }
  })
);
export const EmailSettingsForm: React.FC<Props> = ({
  emailSettings,
  updateEmailSettings,
  showEditEmail,
  toggleEditEmailSettings,
  dialogMode
}) => {
  const classes = useStyles();
  const [doAutoConfig, setDoAutoConfig] = useState(true);
  const [passwordDecrypted, setPasswordDecrypted] = useState('');

  const mailer = useMailer();
  const retryAutoConfig = () => setDoAutoConfig(true);
  const savedEmailDetails: EmailAccount = {
    emailAddress: emailSettings ? emailSettings.emailAddress : '',
    smtp: emailSettings ? emailSettings.smtp : '',
    smtpPort: emailSettings ? emailSettings.smtpPort : 0,
    smtpUser: emailSettings ? emailSettings.smtpUser : '',
    isGoogle: emailSettings ? emailSettings.isGoogle! : false,
    isPrimary: emailSettings ? emailSettings.isPrimary : true,
    encyptedPassword: emailSettings ? emailSettings.encyptedPassword : '',
    // Allow switching from forwarder to user email by passing undefined here
    isForwarder: undefined
  };
  const sealedPassword = useSealedProfilePassword();

  const decryptedPassword = async () =>
    await sealedPassword.decrypt(savedEmailDetails.encyptedPassword);

  const fetchDecryptedPassword = async () => {
    const password = await decryptedPassword();
    setPasswordDecrypted(password);
  };

  const defaultEmailValues: EmailFormValues = {
    emailAddress: savedEmailDetails.emailAddress,
    emailPassword: passwordDecrypted,
    smtp: savedEmailDetails.smtp,
    smtpPort: savedEmailDetails.smtpPort,
    smtpUser: savedEmailDetails.smtpUser,
    isGoogle: savedEmailDetails.isGoogle!
  };

  const [hasValidGoogleEmail, setHasValidGoogleEmail] = useState(false);
  useEffect(() => {
    setHasValidGoogleEmail(!!savedEmailDetails.isGoogle);
  }, [savedEmailDetails.isGoogle]);

  useEffect(() => {
    if (!passwordDecrypted.length) {
      fetchDecryptedPassword();
    }
  }, [showEditEmail]);

  const handleGoogleClick = async (e: EmailAccount) => {
    // Deleted google account
    if (!e.isGoogle) {
      setHasValidGoogleEmail(false);
      return;
    } else {
      setHasValidGoogleEmail(true);
    }

    let encryptedToken;
    if (e.refreshToken) {
      encryptedToken = await sealedPassword.encrypt(e.refreshToken!);
    }
    updateEmailSettings({
      ...e,
      refreshToken: encryptedToken
    });

    if (e.isGoogle) {
      toggleEditEmailSettings(showEditEmail);
    }
  };

  const smtpFields = (
    <div>
      <CustomInputField placeholder="Smtp" name="smtp" type="input" />
      <CustomInputField placeholder="Smtp Port" name="smtpPort" type="number" />
      <CustomInputField placeholder="Smtp User" name="smtpUser" type="input" />
    </div>
  );

  const formikSubmit = async (
    data: EmailFormValues,
    { setFieldError, setSubmitting }: FormikHelpers<EmailFormValues>
  ) => {
    const { emailAddress, emailPassword } = data;
    if (hasValidGoogleEmail) {
      return;
    } else {
      if (!emailAddress) {
        setFieldError('emailAddress', 'Erfordert');
      }
      if (!emailPassword) {
        setFieldError('emailPassword', 'Erfordert');
      }
    }

    if (doAutoConfig) {
      const config = await autoConfig(emailAddress);
      Object.assign(data, config);
    }
    const { smtp, smtpPort, smtpUser } = data;
    const { verified, error } = await mailer
      .getSmtpTransport(smtp, smtpPort, smtpUser, emailPassword)
      .verify();
    const encryptedPassword = await sealedPassword.encrypt(data.emailPassword);

    if (verified && encryptedPassword) {
      const emailSettingsToUpdate: EmailAccount = {
        emailAddress: data.emailAddress,
        encyptedPassword: encryptedPassword,
        isPrimary: true,
        smtp: data.smtp,
        smtpPort: data.smtpPort,
        smtpUser: data.smtpUser,
        isGoogle: false,
        isForwarder: false,
        refreshToken: undefined
      };

      setSubmitting(false);

      setPasswordDecrypted('');
      await updateEmailSettings(emailSettingsToUpdate);
      await toggleEditEmailSettings(showEditEmail);
    } else {
      if (error === 'auth') {
        setFieldError(
          'emailAddress',
          'Authentifizierung fehlgeschlagen. E-Mail, '
        );
        setFieldError('emailPassword', 'Passwort ...');
        setFieldError('smtpUser', '... oder SMTP Username falsch.');
      } else {
        setFieldError(
          'smtp',
          'Verbindungsaufbau fehlegeschlagen. SMTP Server und'
        );
        setFieldError(
          'smtpPort',
          'Port manuell konfigurieren, oder mit andere E-Mail Adresse erneut versuchen.'
        );
      }
      setSubmitting(false);
      setDoAutoConfig(false);
    }
  };

  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!showEditEmail && !hasValidGoogleEmail && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption">{localization.EMAIL}</Typography>
              <Typography>{emailSettings!.emailAddress}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">
                {localization.LABEL_SMTP}
              </Typography>
              <Typography>{emailSettings!.smtp}</Typography>
            </Grid>
          </Grid>
        )}

        <div style={{ flex: 1 }}>
          <GoogleEmailButton
            emailAddress={
              hasValidGoogleEmail ? defaultEmailValues.emailAddress : ''
            }
            isEditMode={showEditEmail}
            updateEmailSettings={handleGoogleClick}
          ></GoogleEmailButton>
        </div>

        {showEditEmail && !hasValidGoogleEmail && (
          <Typography style={{ margin: '1rem auto', width: '8rem' }}>
            {localization.OR}
          </Typography>
        )}

        {showEditEmail && !hasValidGoogleEmail && (
          <Formik
            initialValues={defaultEmailValues}
            validationSchema={EmailSettingsValidationSchema}
            onSubmit={formikSubmit}
          >
            {({ dirty }) => (
              <Form
                className={classes.root}
                autoComplete="off"
                id="settings-form"
                style={{ display: 'flex', flex: 1 }}
              >
                {!hasValidGoogleEmail && (
                  <div>
                    <CustomInputField
                      placeholder="Email"
                      name="emailAddress"
                      type="email"
                    />
                    <CustomInputField
                      placeholder="Email Passwort"
                      name="emailPassword"
                      type="password"
                    />

                    {!doAutoConfig && smtpFields}

                    {!dialogMode && (
                      <div
                        style={{
                          display: 'flex',
                          marginTop: '1rem',
                          justifyContent: 'space-between'
                        }}
                      >
                        {showEditEmail && (
                          <StyledButtonOutlined
                            style={{ margin: '1rem auto 1rem 0' }}
                            type="reset"
                            onClick={() => {
                              if (
                                savedEmailDetails.isGoogle &&
                                !hasValidGoogleEmail
                              ) {
                                setHasValidGoogleEmail(true);
                              }
                              toggleEditEmailSettings(showEditEmail);
                            }}
                          >
                            {localization.CANCEL}
                          </StyledButtonOutlined>
                        )}
                        {!doAutoConfig && (
                          <StyledButtonOutlined
                            style={{ margin: '1rem auto' }}
                            onClick={retryAutoConfig}
                          >
                            {localization.RESET}
                          </StyledButtonOutlined>
                        )}
                        <StyledButton
                          type="submit"
                          style={{ marginLeft: 'auto', marginRight: '0' }}
                          className={classes.saveButton}
                          disabled={!dirty}
                        >
                          {localization.SAVE_CHANGES}
                        </StyledButton>
                      </div>
                    )}
                  </div>
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </React.Fragment>
  );
};
