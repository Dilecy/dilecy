import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { customTheme } from '../styles/theme';
import { EmailAccount } from '@dilecy/model';
import { localization } from '../localization/localization';
import { StyledButtonOutlined } from './StyledButtonOutlined';
import { StyledButton } from './StyledButton';
import { EmailSettingsForm } from '../../feature/ProfileSettings/components/EmailSettingsForm';

interface EmailSettingsDialogProps {
  emailSettings: EmailAccount;
  toggleEditEmailSettings: (show: boolean) => {};

  back: () => void;
  close: () => void;
  confirm: (emailAddress: EmailAccount) => Promise<void>;
}

const useStylesEmailSettingsDialog = makeStyles((theme: Theme) => ({
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
    textAlign: 'left'
  },
  subTitleRow: {
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  buttonRow: {
    marginTop: '4rem'
  }
}));

const EmailSettingsDialog: React.FC<EmailSettingsDialogProps> = (
  props: EmailSettingsDialogProps
) => {
  const classes = useStylesEmailSettingsDialog();

  const { close, back, confirm } = props;
  return (
    <Card className={classes.card}>
      <CardContent className={classes.welcomeMessage}>
        <Typography variant="h4">{localization.SEND_WITH_OWN_EMAIL}</Typography>
        <Typography variant="subtitle2" className={classes.titleRow}>
          {localization.OWN_EMAIL_TIP}
        </Typography>

        <Typography variant="subtitle2" className={classes.subTitleRow}>
          {localization.CONNECT_WITH_EMAIL_SERVER}
        </Typography>

        <div>
          <EmailSettingsForm
            showEditEmail={true}
            toggleEditEmailSettings={() => {}}
            updateEmailSettings={confirm}
            dialogMode={true}
          ></EmailSettingsForm>
        </div>

        <div className={classes.buttonRow}>
          <StyledButtonOutlined
            style={{ width: 250, marginRight: 20 }}
            onClick={() => back()}
          >
            {localization.BACK}
          </StyledButtonOutlined>
          <StyledButtonOutlined
            style={{ width: 250, marginRight: 20 }}
            onClick={() => close()}
          >
            {localization.CANCEL}
          </StyledButtonOutlined>
          <StyledButton
            form="settings-form"
            type="submit"
            style={{ width: 250 }}
          >
            {localization.CONFIRM_AND_SEND}
          </StyledButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettingsDialog;
