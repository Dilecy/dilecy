import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';

const User = require('../../img/Profile.svg').default;
const Google = require('../../img/Google.svg').default;
const Logo = require('../../img/Logo.svg').default;
const Plus = require('../../img/Plus.svg').default;
const Settings = require('../../img/Settings.svg').default;
const Logout = require('../../img/Logout.svg').default;
const Check = require('../../img/Check.svg').default;
const Cross = require('../../img/Cross.svg').default;

const useStyles = makeStyles({
  icon: {
    width: (props?: any) => (props && props.width) || '1.5rem'
  },
  settingsIcon: {
    marginLeft: '-0.375rem'
  },
  userLogo: {
    marginRight: '1rem',
    width: '1.5rem'
  }
});

const useLogoStyles = makeStyles({
  logo: {
    height: (props?: any) => props.height || '7rem',
    width: 'auto'
  }
});

/**
 * IMPORTANT: value viewbox needs to be same as the value in the svg file
 */

function GoogleIcon() {
  return <SvgIcon component={Google} viewBox="0 0 18 18" />;
}

function LogoIcon(props?: { height?: string }) {
  const { logo } = useLogoStyles(props);
  return <SvgIcon className={logo} viewBox="0 0 166.878 51" component={Logo} />;
}

function UserIcon(props?: { width?: string }) {
  const { userLogo } = useStyles(props);
  return (
    <SvgIcon className={userLogo} viewBox="0 0 47.2 47.3" component={User} />
  );
}

function PlusIcon(props?: any) {
  const { icon } = useStyles(props);
  return <SvgIcon className={icon} viewBox="0 0 47.2 47.3" component={Plus} />;
}

function SettingsIcon(props?: any) {
  const { icon, settingsIcon } = useStyles(props);
  return (
    <SvgIcon
      component={Settings}
      viewBox="0 0 112.9 113.2"
      className={`${settingsIcon} ${icon}`}
    />
  );
}

function LogoutIcon(props?: any) {
  const { icon } = useStyles(props);
  return (
    <SvgIcon component={Logout} viewBox="0 0 94.6 114.2" className={icon} />
  );
}

function CheckIcon(props?: any) {
  const { icon } = useStyles(props);
  return <SvgIcon component={Check} viewBox="0 0 47.3 47.3" className={icon} />;
}

function CrossIcon(props?: any) {
  const { icon } = useStyles(props);
  return <SvgIcon component={Cross} viewBox="0 0 47.3 47.3" className={icon} />;
}

export {
  LogoIcon,
  LogoutIcon,
  SettingsIcon,
  UserIcon,
  PlusIcon,
  GoogleIcon,
  CheckIcon,
  CrossIcon
};
