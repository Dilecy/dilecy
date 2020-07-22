import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { customTheme } from '@dilecy/shared/styles/theme';

const useStyles = makeStyles((theme: Theme) => ({
  iframe: {
    width: '99%',
    height: '99%'
  },
  root: {
    maxWidth: customTheme.containerWidth
  }
}));

const HelpPage = () => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <iframe src="https://dilecy.eu/support/" className={classes.iframe} />
    </Container>
  );
};

export default HelpPage;
