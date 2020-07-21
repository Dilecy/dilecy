import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { customTheme } from '../styles/theme';
import { localization } from '../localization/localization';
import { Grid } from '@material-ui/core';
import { CheckIcon, CrossIcon } from '../components/Icon';
import { StyledButton } from './StyledButton';
import { StyledButtonOutlined } from './StyledButtonOutlined';

interface EmailTypeDialogProps {
  close: () => void;
  useOwnEmail: () => void;
  useForwarder: () => void;
}

const useStylesEmailTypeDialog = makeStyles((theme: Theme) => ({
  card: {
    width: '90%',
    maxWidth: '70rem'
  },
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
  smallText: {
    textAlign: 'left'
  },
  headerText: {
    textAlign: 'left',
    padding: '0 1rem'
  },
  benefitRow: {
    borderBottom: '1px solid grey'
  },
  buttonRow: {
    marginTop: '1rem',
    marginBottom: '2rem'
  },
  firstRow: {
    borderTop: '1px solid grey',
    marginTop: '1rem'
  }
}));

const EmailTypeDialog: React.FC<EmailTypeDialogProps> = (
  props: EmailTypeDialogProps
) => {
  const classes = useStylesEmailTypeDialog();

  const { close, useForwarder, useOwnEmail } = props;
  return (
    <Card className={classes.card}>
      <CardContent className={classes.welcomeMessage}>
        <Typography variant="h4">{localization.HOW_SEND_EMAILS}</Typography>

        <Grid container>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" className={classes.headerText}>
              {localization.SEND_WITH_OWN_EMAIL}:
            </Typography>
            <Typography variant="subtitle2" className={classes.headerText}>
              {localization.OWN_EMAIL_TIP}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" className={classes.headerText}>
              {localization.USE_DILECY}:
            </Typography>
            <Typography variant="subtitle2" className={classes.headerText}>
              {localization.USE_DILECY_TIP}
            </Typography>
          </Grid>

          <Grid
            container
            className={`${classes.benefitRow} ${classes.firstRow}`}
            alignItems="center"
          >
            <Grid item xs={4}>
              <Typography variant="subtitle2" className={classes.smallText}>
                {localization.WE_DONT_GET_YOUR_ADDRESS}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CheckIcon></CheckIcon>
            </Grid>
            <Grid item xs={4}>
              <CrossIcon></CrossIcon>
            </Grid>
          </Grid>

          <Grid container className={classes.benefitRow} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle2" className={classes.smallText}>
                {localization.WE_DONT_KNOW_WHAT_YOU_SEND}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <CheckIcon></CheckIcon>
            </Grid>
            <Grid item xs={4}>
              <CrossIcon></CrossIcon>
            </Grid>
          </Grid>

          <Grid container className={classes.benefitRow} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle2" className={classes.smallText}>
                {localization.PASSWORD_NOT_REQUIRED}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <CrossIcon></CrossIcon>
            </Grid>

            <Grid item xs={4}>
              <CheckIcon></CheckIcon>
            </Grid>
          </Grid>

          <Grid container className={classes.benefitRow} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="subtitle2" className={classes.smallText}>
                {localization.EFFORT}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>{localization.LITTLE_EFFORT}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>{localization.BIG_EFFORT}</Typography>
            </Grid>
          </Grid>

          <Grid container className={classes.buttonRow}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <StyledButton onClick={() => useOwnEmail()}>
                {localization.USE_OWN_EMAIL}
              </StyledButton>
            </Grid>
            <Grid item xs={4}>
              <StyledButton onClick={() => useForwarder()}>
                {localization.USE_DILECY}
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>

        <StyledButtonOutlined onClick={() => close()}>
          {localization.CANCEL}
        </StyledButtonOutlined>
      </CardContent>
    </Card>
  );
};

export default EmailTypeDialog;
