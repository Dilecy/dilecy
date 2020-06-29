/* eslint-disable @typescript-eslint/camelcase */
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import {
  TypedUseSelectorHook,
  useSelector as useSelectorGeneric,
  useDispatch
} from 'react-redux';
import StyledButton from '../../../shared/components/StyledButton';
import { ProfileDetails, EmailAccount } from '../../../model/clientModel';
import { ConsentSettings } from './ConsentSettings';
import { EmailSettingsForm } from './EmailSettingsForm';
import { ProfileSettingsForm } from './ProfileSettingsForm';
import { ConsentAction } from '../../../model/serverModel';
import { useVisitorIdGenerator } from '../../../core/dependencies';
import { DeleteProfile } from './DeleteProfile';
import { SealedPassword } from '../../../core/crypto/interface';
import { postConsent } from '../../CreateProfile/actions';
import { changeProfilePassword, updateProfile } from '../actions';
import { deleteProfile } from '../../Login/actions';
import { customTheme } from '../../../shared/styles/theme';
import { RootState } from 'typesafe-actions';
import { localization } from '../../../shared/localization';

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorGeneric;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      height: '100%',
      maxWidth: customTheme.containerWidth + ' !important',
      backgroundColor: theme.palette.background.default
    },
    heading: {
      fontSize: customTheme.fontSizeH1,
      flexBasis: '33.33%',
      flexShrink: 0
    },
    secondaryHeading: {
      fontSize: customTheme.fontSizeH2,
      color: theme.palette.grey[700]
    },
    expansionPanels: {
      borderRadius: customTheme.borderRadius,
      boxShadow: customTheme.shadow,
      overflow: 'hidden',
      backgroundColor: 'white',

      '& .MuiPaper-elevation1': {
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.2)'
      }
    },
    expansionPanelDetails: {
      flexDirection: 'column'
    },
    iconButton: {
      width: 'fit-content',
      position: 'absolute',
      right: 10,
      top: 40
    }
  })
);

const ProfileSettingsPage: React.FC = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [editProfile, showEditProfile] = React.useState<boolean>(false);
  const [editEmailSettings, showEditEmailSettings] = React.useState<boolean>(
    false
  );
  const [editConsentSettings, showEditConsentSettings] = React.useState<
    boolean
  >(false);
  const [deleteProfileAlert, setDeleteProfileAlert] = React.useState<boolean>(
    false
  );
  const dispatch = useDispatch();
  const generateVisitorId = useVisitorIdGenerator();

  const loginState = (state: RootState) => state.loginStatus;
  const loggedIn = useSelector(loginState).loggedIn; // to use typescript feature with redux hooks

  const userEmail = loggedIn
    ? loggedIn.profileDetails.emailAccounts[0]
    : undefined;

  const consentStatus = (state: RootState) => state.consentStatus;
  const consentSelector = useSelector(consentStatus);

  const [consentState, setConsentState] = React.useState({
    tracking: !!consentSelector.tracking,
    ux_research: !!consentSelector.ux_research
  });

  const handleToggleEditConsent = (event: boolean) => {
    showEditConsentSettings(!event);
  };

  const handleConsentChange = async (consent: {
    tracking: boolean;
    ux_research: boolean;
  }) => {
    setConsentState(consent);
    const consentActions: ConsentAction[] = [];
    if (consent.tracking !== consentState.tracking) {
      consentActions.push({
        purpose: 'tracking',
        action: consent.tracking ? 'given' : 'revoked',
        data: await generateVisitorId()
      });
    }
    if (consent.ux_research !== consentState.ux_research) {
      consentActions.push({
        purpose: 'ux_research',
        action: consent.ux_research ? 'given' : 'revoked',
        data: userEmail ? userEmail.emailAddress : ''
      });
    }

    dispatch(postConsent(consentActions));
    handleToggleEditConsent(editConsentSettings);
  };

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleToggleEditProfile = (event: boolean) => {
    showEditProfile(!event);
  };
  const handleToggleEditEmailSettings = async (event: boolean) => {
    try {
      showEditEmailSettings(!event);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateProfile = (event: Partial<ProfileDetails>) => {
    if (loggedIn) {
      dispatch(
        updateProfile({
          profile: loggedIn.profile,
          profileDetails: event
        })
      );
    }
  };
  const handleUpdateEmailSettings = async (event: EmailAccount) => {
    try {
      const emailAccountToUpdate = { emailAccounts: [event] };
      if (loggedIn) {
        dispatch(
          updateProfile({
            profile: loggedIn.profile,
            profileDetails: emailAccountToUpdate
          })
        );
      }
    } catch (e) {
      console.log('an error occurred', e);
    }
  };

  const handleUpdatePassword = (event: {
    oldPassword: SealedPassword;
    newPassword: SealedPassword;
  }) => {
    const { oldPassword, newPassword } = event;
    try {
      if (loggedIn) {
        dispatch(
          changeProfilePassword({
            profile: loggedIn.profile,
            oldPassword: oldPassword,
            newPassword: newPassword
          })
        );
      }
    } catch (e) {
      console.log('An error occurred while updating password', e);
    }
  };

  const handleDeleteProfile = () => {
    try {
      if (loggedIn) {
        dispatch(
          deleteProfile({
            profile: loggedIn.profile,
            consent: {
              tracking: undefined,
              ux_research: userEmail ? userEmail.emailAddress : undefined
            }
          })
        );
        setDeleteProfileAlert(false);
      }
    } catch (e) {
      console.log('An error occurred while deleting profile', e);
    }
  };

  return (
    <Container className={classes.root}>
      <h1 className={classes.heading}>{localization.USER_PROFILE}</h1>
      {loggedIn && (
        <div className={classes.expansionPanels}>
          <ExpansionPanel
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.secondaryHeading}>
                {localization.PROFILE_INFORMATION}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {!editProfile && (
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleToggleEditProfile(editProfile)}
                >
                  <EditIcon />
                </IconButton>
              )}
              <ProfileSettingsForm
                profileDetails={loggedIn.profileDetails}
                showEditProfile={editProfile}
                toggleEditProfile={handleToggleEditProfile}
                updateProfile={handleUpdateProfile}
                updatePassword={handleUpdatePassword}
                savedPasswordHash={loggedIn.profile.passwordHash}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.secondaryHeading}>
                {localization.EMAIL_SETTINGS}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
              {!editEmailSettings && (
                <IconButton
                  className={classes.iconButton}
                  onClick={() =>
                    handleToggleEditEmailSettings(editEmailSettings)
                  }
                >
                  <EditIcon />
                </IconButton>
              )}

              {userEmail && (
                <EmailSettingsForm
                  emailSettings={userEmail}
                  showEditEmail={editEmailSettings}
                  toggleEditEmailSettings={handleToggleEditEmailSettings}
                  updateEmailSettings={handleUpdateEmailSettings}
                />
              )}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography className={classes.secondaryHeading}>
                {localization.DATA_PROTECTION}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {!editConsentSettings && (
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleToggleEditConsent(editConsentSettings)}
                >
                  <EditIcon />
                </IconButton>
              )}
              <ConsentSettings
                consentState={consentState}
                showEditConsent={editConsentSettings}
                toggleEditConsentSettings={handleToggleEditConsent}
                onConsentChange={handleConsentChange}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div style={{ margin: '1.25rem' }}>
            <StyledButton
              color={'secondary'}
              onClick={() => setDeleteProfileAlert(true)}
            >
              {localization.DELETE_PROFILE}
            </StyledButton>
          </div>
          <DeleteProfile
            open={deleteProfileAlert}
            onDeleteClicked={handleDeleteProfile}
            onCancelClicked={() => setDeleteProfileAlert(false)}
          />
        </div>
      )}
    </Container>
  );
};

export default ProfileSettingsPage;
