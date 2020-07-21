import React from 'react';
import { connect, useSelector } from 'react-redux';
import SideBarMenu from './SideBarMenu';
import Container from '@material-ui/core/Container';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Profile, ProfileDetails } from '@dilecy/model/clientModel';
import { RootState } from 'typesafe-actions';
import { requestLogout } from '../../actions';
import { LogoIcon, SettingsIcon, LogoutIcon } from '@dilecy/shared';
import { customTheme } from '@dilecy/shared/styles/theme';

import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SideBarMenuItem from './SideBarMenuItem';

const useStyles = makeStyles((theme: Theme) => ({
  logo: {
    marginBottom: theme.spacing(customTheme.spacing),
    marginLeft: theme.spacing(customTheme.spacing),
    marginTop: theme.spacing(customTheme.spacing),
    marginRight: 'auto',
    color: theme.palette.primary.main,

    '& .MuiSvgIcon-root': {
      width: 'auto',
      height: '3rem'
    }
  },
  listItem: {
    paddingLeft: theme.spacing(customTheme.spacing),
    paddingRight: theme.spacing(customTheme.spacing),

    '& .MuiTypography-body1': {
      fontSize: customTheme.fontSizeBodyLarge
    }
  },
  listItemIcon: {
    justifyContent: 'center',
    maxWidth: '1.625rem',
    minWidth: '1.625rem',
    marginRight: '0.5rem',
    color: 'inherit'
  },
  toolbar: {
    marginTop: 'auto',
    padding: '0'
  },
  root: {
    paddingLeft: 0,
    paddingRight: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative'
  },
  selection: {
    flexGrow: 1,
    padding: 0,
    paddingTop: '3.75rem'
  },
  menu: {
    padding: 0
  },
  profile: {
    padding: 0,
    height: '6.25rem'
  },
  profileName: {
    paddingLeft: theme.spacing(customTheme.spacing)
  },
  appVersion: {
    fontSize: customTheme.fontSizeBodySmall,
    color: '#8c8c8c',
    padding: `${theme.spacing(customTheme.spacing) / 16 / 2}rem ${theme.spacing(
      customTheme.spacing
    ) / 16}rem`
  }
}));

interface Props {
  logout: typeof requestLogout;
  loggedIn?: {
    profile: Profile;
    profileDetails: ProfileDetails;
  };
}

const SideBar = ({ logout, loggedIn }: Props) => {
  const classes = useStyles();
  const appVersion = useSelector((state: RootState) => state.appInfo.version);
  return (
    <Container className={classes.root}>
      <div className={classes.logo}>
        <LogoIcon />
      </div>
      <Typography className={classes.profileName}>
        {!!loggedIn && loggedIn.profileDetails.profileName}
      </Typography>

      <Container className={classes.selection}>
        <SideBarMenu loggedIn={Boolean(loggedIn)} />
      </Container>

      {loggedIn && (
        <List className={classes.toolbar}>
          <SideBarMenuItem
            className={classes.listItem}
            view={'settings'}
            title="Einstellungen"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <SettingsIcon />
            </ListItemIcon>
          </SideBarMenuItem>
          <SideBarMenuItem
            title="Logout"
            onClick={() => logout()}
            className={classes.listItem}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <LogoutIcon />
            </ListItemIcon>
          </SideBarMenuItem>
        </List>
      )}

      <span className={classes.appVersion}>Version {appVersion}</span>
    </Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  loggedIn: state.loginStatus.loggedIn
});

const dispatchToProps = {
  logout: requestLogout
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(SideBar);
