import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { customTheme } from '../styles/theme';
import { EmailSettingsForm } from '../../feature/ProfileSettings/components/EmailSettingsForm';
import { EmailAccount } from '../../model/clientModel';
import { localization as localizations } from '../localization';

interface EmailSettingsDialogProps {
  emailSettings: EmailAccount;
  toggleEditEmailSettings: (show: boolean) => {};
  updateEmailSettings: (e: EmailAccount) => Promise<void>;
}

const useStylesEmailSettingsDialog = makeStyles((theme: Theme) => ({
  card: { maxWidth: '50%' },
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
  }
}));

const EmailSettingsDialog: React.FC<EmailSettingsDialogProps> = (
  props: EmailSettingsDialogProps
) => {
  const classes = useStylesEmailSettingsDialog();

  const { emailSettings, toggleEditEmailSettings, updateEmailSettings } = props;
  return (
    <Card className={classes.card}>
      <CardContent className={classes.welcomeMessage}>
        <Typography variant="h4">{localizations.EMAIL_SETTINGS}</Typography>

        <EmailSettingsForm
          emailSettings={emailSettings}
          showEditEmail={true}
          toggleEditEmailSettings={async () => {
            toggleEditEmailSettings(false);
          }}
          updateEmailSettings={updateEmailSettings}
        ></EmailSettingsForm>

        <Typography variant="subtitle1">
          {localizations.EMAIL_CLIENT_EXPLANATION}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmailSettingsDialog;
