import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { RootState } from 'typesafe-actions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import StyledButton from '../../shared/components/StyledButton';
import StyledButtonOutlined from '../../shared/components/StyledButtonOutlined';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { Profile } from '../../model/clientModel';
import { LoginPageSelection } from '../../store/stateModel';
import { usePasswordSealer } from '../../core/dependencies';
import { login } from './actions';
import { selectPage, selectView } from '../../core/actions';
import CreateProfileForm from '../CreateProfile/components/CreateProfilePage';
import { LogoIcon, PlusIcon, UserIcon } from '../../shared/components/Icon';
import { customTheme } from '../../shared/styles/theme';
import { appVersion } from '../../core/appInfo';
import { localization } from '../../shared/localization';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: '1',
    textAlign: 'center',
    borderRadius: customTheme.borderRadius,
    position: 'relative',
    fontFamily: 'Montserrat SemiBold',
    fontSize: customTheme.fontSizeH2,
    boxShadow: 'none',
    paddingBottom: '4rem',
    display: 'flex',
    flexDirection: 'column',

    '& .MuiCollapse-container': {
      marginTop: '4rem'
    },
    '& .MuiCardActionArea-root': {
      height: '4rem',
      position: 'absolute',
      left: '0',
      top: '0',
      right: '0'
    }
  },
  appVersion: {
    position: 'absolute',
    color: '#8c8c8c',
    fontSize: customTheme.fontSizeBodySmall,
    left: '1.5rem',
    bottom: '1rem'
  },
  userLogo: {
    marginRight: '1rem'
  },
  addIcon: {
    marginRight: '1rem'
  },
  actions: {
    display: 'flex',
    padding: '1.25rem 0.75rem',
    alignItems: 'center',
    justifyContent: 'space-around',

    '& button': {
      margin: '0 0.5rem'
    }
  },
  logoContainer: {
    color: customTheme.colorPrimary,
    margin: '6.5rem 0 3.5rem 0',

    '& .MuiSvgIcon-root': {
      width: 'auto',
      height: '5rem'
    }
  },
  row: {
    marginBottom: '0.5rem'
  },
  cardWithShadow: {
    minHeight: '4rem',
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '32rem',
    width: '32rem',
    margin: '0.5rem auto',
    position: 'relative',

    '& .MuiCardContent-root:last-child': {
      paddingBottom: '1rem'
    },

    '& .MuiCardContent-root': {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Montserrat SemiBold',
      fontSize: customTheme.fontSizeH2
    }
  },
  appBlocked: {
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    maxWidth: '32rem',
    width: '32rem',
    margin: '0.5rem auto',
    position: 'relative'
  },
  downloadLink: {
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  supportButton: {
    position: 'absolute',
    bottom: '1rem',
    padding: '0.5rem',
    width: '6.25rem',
    left: 'calc(50% - 3.125rem)'
  },
  password: {
    textAlign: 'left',
    paddingLeft: 20
  },
  buttonContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    paddingLeft: 20
  }
}));

interface Props {
  profiles: Profile[];
  activePage: LoginPageSelection;
  blocked: boolean;
  login: typeof login;
  selectPage: typeof selectPage;
  selectView: typeof selectView;
}

const LoginPage = (props: Props) => {
  const [loginAttempt, setLoginAttempt] = React.useState(-1);
  const [password, setPassword] = React.useState('');
  const [wrong, setWrong] = React.useState(false);
  const sealPassword = usePasswordSealer();
  const classes = useStyles();
  const cancel = () => {
    setLoginAttempt(-1);
    setPassword('');
    setWrong(false);
  };

  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, props.profiles.length);
  }, [props.profiles]);

  const handleClick = (index: number) => {
    setLoginAttempt(index);
    setPassword('');
    setWrong(false);
    const scrollItem = document.getElementById(`card-${index}`);
    if (scrollItem) {
      scrollItem.scrollIntoView({ behavior: 'smooth' });
    }

    const input = itemsRef.current[index] as HTMLInputElement;
    setTimeout(() => {
      input.focus();
    });
  };

  const tryLogin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const profile = props.profiles[loginAttempt];
    const sealedPassword = sealPassword(password);
    if (sealedPassword.matchesHash(profile.passwordHash)) {
      props.login({ profile, sealedPassword });
    } else {
      setWrong(true);
    }
  };

  const getProfiles = () =>
    props.profiles.map((profile, index) => (
      <div className={classes.row} key={index}>
        <form>
          <Card id={`card-${index}`} className={classes.cardWithShadow}>
            <CardActionArea onClick={() => handleClick(index)}>
              <CardContent>
                <UserIcon />
                {profile.profileName}
              </CardContent>
            </CardActionArea>
            <Collapse in={index === loginAttempt}>
              <div className={classes.password}>
                <TextField
                  error={wrong}
                  value={password}
                  type="password"
                  label="Passwort"
                  onChange={event => setPassword(event.target.value)}
                  inputRef={el => (itemsRef.current[index] = el as never)}
                />
              </div>
              <div className={classes.actions}>
                <StyledButtonOutlined type="reset" fullWidth onClick={cancel}>
                  Abbrechen
                </StyledButtonOutlined>
                <StyledButton type="submit" fullWidth onClick={tryLogin}>
                  Anmelden
                </StyledButton>
              </div>
            </Collapse>
          </Card>
        </form>
      </div>
    ));

  switch (props.activePage) {
    case 'login':
      return (
        <Card className={classes.root}>
          <div className={classes.logoContainer}>
            <LogoIcon />
          </div>
          <div
            style={{
              margin: 'auto 0',
              overflow: 'auto'
            }}
          >
            <div className={classes.buttonContainer}>
              {getProfiles()}

              <div className={classes.row}>
                {props.blocked ? (
                  <Card className={classes.appBlocked}>
                    <CardContent>
                      <Typography>
                        {localization.APP_VERSION_MISMATCH_1}
                      </Typography>
                      <Typography>
                        {localization.APP_VERSION_MISMATCH_2}
                        <a
                          className={classes.downloadLink}
                          onClick={() =>
                            window.open('https://dilecy.eu/download')
                          }
                        >
                          https://dilecy.eu/download
                        </a>
                        .
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    className={classes.cardWithShadow}
                    onClick={() => props.selectPage({ login: 'createProfile' })}
                  >
                    <CardActionArea>
                      <CardContent>
                        <div className={classes.addIcon}>
                          <PlusIcon />
                        </div>
                        Neues Konto erstellen
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )}
              </div>
            </div>
          </div>

          <Button
            className={classes.supportButton}
            onClick={() => props.selectView('help')}
          >
            Support
          </Button>

          <span className={classes.appVersion}>Version {appVersion}</span>
        </Card>
      );
    case 'createProfile':
      return <CreateProfileForm />;
  }
};

const mapStateToProps = (state: RootState) => ({
  profiles: state.loginStatus.profiles,
  activePage: state.selectedPage.login,
  blocked: state.loginStatus.blocked
});

const dispatchToProps = {
  login,
  selectPage,
  selectView
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(LoginPage);
