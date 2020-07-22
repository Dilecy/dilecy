import React from 'react';
import List from '@material-ui/core/List';
import { SideBarMenuItem } from './SideBarMenuItem';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { customTheme } from '@dilecy/shared/styles/theme';

interface Props {
  loggedIn: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    paddingLeft: theme.spacing(customTheme.spacing),
    paddingRight: theme.spacing(customTheme.spacing),
    '& .MuiTypography-body1': {
      fontSize: customTheme.fontSizeBodyLarge
    }
  }
}));

const SideBarMenu: React.FC<Props> = ({ loggedIn }) => {
  const { listItem } = useStyles();
  return (
    <List component="nav">
      {loggedIn ? (
        <>
          <SideBarMenuItem className={listItem} view="home" title="Übersicht" />
          <SideBarMenuItem
            className={listItem}
            view="newRequest"
            title="Neue Anfrage"
          />
          <SideBarMenuItem
            className={listItem}
            view="oldRequests"
            title="Alte Anfragen"
          />
        </>
      ) : (
        <>
          <SideBarMenuItem className={listItem} view="login" title="Login" />
        </>
      )}
      <SideBarMenuItem className={listItem} view="help" title="Support" />
    </List>
  );
};

export { SideBarMenu };
