import React, { useState } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { NewRequestStatus, Recipient } from '../../../store/stateModel';

import RecipientTable from '../components/RecipientTable';
import {
  getRecipientsWithStatus,
  getUserEmail,
  getUserProfile
} from '../selectors';
import {
  confirmAndSend,
  validateNewRequestStep,
  selectNewRequestStep
} from '../actions';
import { RootState } from 'typesafe-actions';
import { BrandSelection } from '../../../store/stateModel';
import StyledButton from '../../../shared/components/StyledButton';
import { customTheme } from '../../../shared/styles/theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import { localization } from '../../../shared/localization';
import Backdrop from '@material-ui/core/Backdrop';
import { EmailAccount, Profile } from '../../../model/clientModel';
import { hasEmail } from '../../../shared/helpers/helper';
import { updateProfile } from '../../ProfileSettings/actions';
import EmailSettingsDialog from '../../../shared/components/EmailSettingsDialog';
import EmailTypeDialog from '../../../shared/components/EmailTypeDialog';
import EmailForwarderDialog from '../../../shared/components/EmailForwarderDialog';

interface Props {
  brandSelection: BrandSelection;
  status: NewRequestStatus;
  recipients: Recipient[];
  confirmAndSend: typeof confirmAndSend;
  validateNewRequestStep: typeof validateNewRequestStep;
  selectNewRequestStep: typeof selectNewRequestStep;
  isProcessing: boolean;
  userEmail: EmailAccount;
  updateProfile: typeof updateProfile;
  userProfile: Profile;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(customTheme.spacing),
    display: 'flex',
    flexDirection: 'column',

    '&.empty': {
      justifyContent: 'flex-end'
    }
  },
  heading: {
    color: theme.palette.primary.main,
    textAlign: 'right',
    fontWeight: 'bold'
  },
  text: {
    margin: '0.625rem 0'
  },
  finalStep: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '21.875rem'
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1rem',

    '&.empty': {
      marginBottom: 0
    }
  },
  sendButton: {
    margin: '1rem auto 0 auto'
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',

    '& .MuiCard-root': {
      borderRadius: customTheme.borderRadius
    }
  }
}));

const SummaryStep = (props: Props) => {
  const {
    brandSelection,
    recipients,
    status,
    confirmAndSend,
    validateNewRequestStep,
    selectNewRequestStep,
    isProcessing,
    userEmail,
    updateProfile,
    userProfile
  } = props;

  const classes = useStyles();
  const hasRecipients = recipients.length > 0;
  const addEmptyClass = (origClass: string) =>
    `${origClass} ${hasRecipients ? '' : 'empty'}`;

  const [showEmailType, setShowEmailType] = useState(false);
  const [showEmailForwarder, setShowEmailForwarder] = useState(false);
  const [showOwnEmail, setShowOwnEmail] = useState(false);

  React.useEffect(() => {
    hasRecipients
      ? validateNewRequestStep({ summary: true })
      : validateNewRequestStep({ summary: false });
  }, [recipients.length]);

  const handleUpdateEmailSettings = async (event: EmailAccount) => {
    try {
      const emailAccountToUpdate = { emailAccounts: [event] };
      updateProfile({
        profile: userProfile,
        profileDetails: emailAccountToUpdate,
        sendRequest: true
      });
      setShowEmailForwarder(false);
      setShowEmailType(false);
      setShowOwnEmail(false);
    } catch (e) {
      console.log('an error occurred', e);
    }
  };

  const getOwnEmailDialog = () =>
    showOwnEmail && (
      <Backdrop open={showOwnEmail} className={classes.backdrop}>
        <EmailSettingsDialog
          emailSettings={userEmail}
          toggleEditEmailSettings={async () => {
            setShowOwnEmail(false);
          }}
          back={() => {
            setShowOwnEmail(false);
            setShowEmailType(true);
          }}
          close={() => {
            setShowOwnEmail(false);
          }}
          confirm={handleUpdateEmailSettings}
        ></EmailSettingsDialog>
      </Backdrop>
    );

  const getEmailTypeDialog = () =>
    showEmailType && (
      <Backdrop open={showEmailType} className={classes.backdrop}>
        <EmailTypeDialog
          close={() => setShowEmailType(false)}
          useForwarder={() => {
            setShowEmailType(false);
            setShowEmailForwarder(true);
          }}
          useOwnEmail={() => {
            setShowEmailType(false);
            setShowOwnEmail(true);
          }}
        ></EmailTypeDialog>
      </Backdrop>
    );

  const getEmailForwarderDialog = () =>
    showEmailForwarder && (
      <Backdrop open={showEmailForwarder} className={classes.backdrop}>
        <EmailForwarderDialog
          close={() => setShowEmailForwarder(false)}
          back={() => {
            setShowEmailForwarder(false);
            setShowEmailType(true);
          }}
          confirm={handleUpdateEmailSettings}
        ></EmailForwarderDialog>
      </Backdrop>
    );

  return (
    <div className={addEmptyClass(classes.root)}>
      {isProcessing && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
      {!isProcessing && (
        <React.Fragment>
          <div className={addEmptyClass(classes.headingContainer)}>
            {hasRecipients ? (
              <Typography>{localization.RECIPIENT}</Typography>
            ) : (
              <div className={classes.emptyContainer}>
                <Typography>{localization.RECIPIENTS_EMPTY}</Typography>
                <StyledButton
                  onClick={() => selectNewRequestStep('select')}
                  className={classes.sendButton}
                >
                  {localization.BRAND_SELECTION}
                </StyledButton>
              </div>
            )}
          </div>

          <RecipientTable recipients={recipients} />
          {status === 'creating' && hasRecipients && (
            <div className={classes.finalStep}>
              <Typography className={classes.text}>
                Die Anfragen werden über die von dir verwendete E-Mailadresse
                versendet. Wir bekommen nicht mit, an wen du eine Anfrage
                versendest. Die Antworten der Unternehmen erhältst du ebenfalls
                an deine eigene E-Mailadresse.
              </Typography>
              <StyledButton
                onClick={() => {
                  if (hasEmail(userEmail)) {
                    confirmAndSend();
                  } else {
                    setShowEmailType(true);
                  }
                }}
                className={classes.sendButton}
              >
                {Object.keys(brandSelection).length === 1
                  ? '1 Email absenden'
                  : `${Object.keys(brandSelection).length} Emails absenden`}
              </StyledButton>
            </div>
          )}
          {status === 'sent' && (
            <div>
              <Typography className={classes.text}>
                Herzlichen Glückwunsch! Deine Anfragen wurden erfolgreich
                versendet. Du erhältst die Antworten direkt von den Unternehmen.
                Viele Unternehmen werden dich nach zusätzlichen Informationen
                fragen, um dich einwandfrei zu identifizieren. Du hast ein Recht
                auf Antwort in elektronischer Form. Trotzdem werden dir
                wahrscheinlich nicht alle Unternehmen direkt auf deine Mail
                Antworten. Einige Unternehmen werden dir per Post oder gar nicht
                antworten.
              </Typography>
            </div>
          )}
        </React.Fragment>
      )}

      {getEmailTypeDialog()}
      {getOwnEmailDialog()}
      {getEmailForwarderDialog()}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  brandSelection: state.newRequestState.brandSelection,
  status: state.newRequestState.status,
  recipients: getRecipientsWithStatus(state),
  isProcessing: state.newRequestState.isProcessing,
  userEmail: getUserEmail(state),
  userProfile: getUserProfile(state)
});

const dispatchToProps = {
  confirmAndSend,
  validateNewRequestStep,
  selectNewRequestStep,
  updateProfile
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(SummaryStep);
