import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { SideBar, PageRouter } from './core/components';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';

import { CustomAlert } from './shared/components';
import { dismissAlert } from './core/actions';
import { RootState } from 'typesafe-actions';
import { customTheme } from './shared/styles/theme';

const useStyles = makeStyles(theme => ({
  viewport: {
    flexGrow: 1,
    padding: theme.spacing(customTheme.spacing),
    backgroundColor: theme.palette.background.default,
    maxWidth: 'unset',
    overflow: 'auto',
    display: 'flex',
    height: '100vh',
    minHeight: '100vh',
    justifyContent: 'center'
  },
  root: {
    margin: 0,
    flex: '1',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontSize: customTheme.fontSizeBodyLarge,
    '& .MuiListItem-root': {
      color: 'black'
    },
    '& .MuiListItem-root.Mui-selected': {
      borderRight: `8px solid ${theme.palette.primary.main}`,
      background: customTheme.colorWhite,
      color: theme.palette.primary.main,
      fontWeight: 'bold'
    }
  },
  container: {
    padding: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    maxWidth: 'unset'
  },
  sidebar: {
    flexShrink: 0,
    padding: 0,
    maxHeight: '100vh',
    position: 'sticky',
    top: '0',
    bottom: '0',
    width: '14rem'
  }
}));

const App = () => {
  const dispatch = useDispatch();
  const alertStateSelector = useSelector((state: RootState) => state.alerts);
  const activePage = useSelector((state: RootState) => state.selectedView);
  const classes = useStyles({ isLogin: activePage === 'login' });
  const handleAlertClose = (index: number) => {
    dispatch(dismissAlert(index));
  };
  return (
    <div className={classes.root}>
      {alertStateSelector.length > 0 &&
        alertStateSelector.map((alert, index) => (
          <CustomAlert
            key={index}
            open={true}
            handleClose={() => handleAlertClose(index)}
            horizontal="right"
            vertical="bottom"
            message={alert}
          />
        ))}
      <Container className={classes.container}>
        {activePage !== 'login' && (
          <div className={classes.sidebar}>
            <SideBar />
          </div>
        )}
        <Container className={classes.viewport}>
          <PageRouter />
        </Container>
      </Container>
    </div>
  );
};

export default App;
