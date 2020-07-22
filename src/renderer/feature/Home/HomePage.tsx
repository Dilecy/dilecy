import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';

import Link from '@material-ui/core/Link';
import { SuggestBrand } from '../NewRequest/components/SuggestBrand';
import { UpdateInfo } from '@dilecy/model';
import { selectView, setWelcomeMessageToggle } from '@dilecy/core';
import { RootState } from 'typesafe-actions';
import {
  startRating,
  clearShowRating,
  clearShowFeedback,
  startFeedback
} from './actions';

import { customTheme } from '@dilecy/shared/styles/theme';
import {
  isDevelopment,
  StyledRating,
  UserIcon,
  StyledButton,
  StyledButtonOutlined,
  localization,
  OkDialog
} from '@dilecy/shared';
import {
  getPrimaryEmail,
  getRating,
  getShowRatingMessage,
  getShowFeedbackMessage,
  getTotalDomains
} from './selectors';
import { EmailAccount } from '@dilecy/model/clientModel';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: customTheme.containerWidth,
    padding: '0',

    '& .MuiGrid-spacing-xs-5 > .MuiGrid-item': {
      padding: theme.spacing(customTheme.spacing / 2)
    }
  },
  fullWidth: {
    width: '100%'
  },
  sendButton: {
    marginLeft: 'auto',
    marginTop: '0.625rem'
  },
  email: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontSize: customTheme.fontSizeH2,
    marginTop: '1.25rem'
  },
  buttonContainer: {
    [theme.breakpoints.down('lg')]: {
      width: '50%'
    },
    [theme.breakpoints.up('lg')]: {
      width: 'inherit'
    }
  },
  card: {
    minHeight: '100%',
    borderRadius: customTheme.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    boxShadow: 'none  '
  },
  ratingForm: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',

    [theme.breakpoints.down('lg')]: {
      justifyContent: 'center'
    },
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'flex-start'
    }
  },
  ratingFormLabel: {
    marginRight: theme.spacing(customTheme.spacing)
  },
  styledRating: {
    fontSize: '2rem'
  },
  cardWithShadow: {
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  cardContent: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${theme.spacing(customTheme.spacing) / 16}rem !important`,
    flexDirection: 'column'
  },
  cardContentNewRequest: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    [theme.breakpoints.down('lg')]: {
      flexDirection: 'row'
    },

    [theme.breakpoints.up('lg')]: {
      flexDirection: 'column'
    }
  },
  alignItemsFlexStart: {
    alignItems: 'flex-start'
  },
  feedback: {
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    padding: theme.spacing(2),
    margin: '0.5rem 0',
    width: `calc(100% - ${(theme.spacing(2) * 2) / 16}rem)`,

    '& .MuiInputBase-root': {
      fontSize: customTheme.fontSizeBodyLarge
    }
  },
  title: {
    textAlign: 'center',
    fontSize: customTheme.fontSizeH2
  },
  button: {
    margin: '0.33rem auto',
    textAlign: 'center'
  },
  help: {
    zIndex: (props: boolean) => (props ? theme.zIndex.drawer + 2 : 0),
    backgroundColor: (props: boolean) => (props ? 'white' : 'inherit'),
    '&:hover': {
      backgroundColor: (props: boolean) => (props ? 'white' : 'inherit')
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',

    '& .MuiCard-root': {
      borderRadius: customTheme.borderRadius
    }
  }
}));

interface Props {
  updateInfo: Partial<UpdateInfo>;
  showWelcomeMessage: boolean;
  showRatingMessage: boolean;
  showFeedbackMessage: boolean;
  emailAccount?: EmailAccount;
  totalDomains: number;
  rating?: number;
}

const HomePage = (props: Props) => {
  const {
    showWelcomeMessage,
    showRatingMessage,
    showFeedbackMessage,
    updateInfo,
    emailAccount,
    rating,
    totalDomains
  } = props;
  const classes = useStyles(
    showWelcomeMessage || showRatingMessage || showFeedbackMessage
  );
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [suggestBrandVisible, setSuggestBrandVisible] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState('');

  const activeMail = emailAccount && emailAccount.emailAddress;

  useEffect(() => setFeedbackMessage(''), [showFeedbackMessage]);

  const handleWelomeMessage = () => {
    dispatch(setWelcomeMessageToggle(false));
  };

  const getPlaceholder = () => (
    <Grid
      item
      lg={7}
      xs={12}
      style={{ visibility: isDevelopment() ? 'visible' : 'hidden' }}
    >
      <Card className={classes.cardWithShadow}>
        <CardContent className={classes.cardContent}>
          Platzhalter für alte/ausstehende Anfragen
        </CardContent>
      </Card>
    </Grid>
  );

  const getActionCard = () => (
    <Grid item lg={5} xs={12}>
      <Card className={classes.card}>
        <CardContent
          className={classes.cardContent + ' ' + classes.cardContentNewRequest}
        >
          <div>
            Bisher kannst du zwischen {totalDomains} Unternehmen auswählen.
            <br />
            <br />
            Fehlt dir noch ein Unternehmen?
            <br />
            <br />
          </div>

          <Grid className={classes.buttonContainer} container spacing={3}>
            <Grid item xs={12}>
              <StyledButtonOutlined
                fullWidth
                onClick={() => setSuggestBrandVisible(true)}
              >
                Fehlendes Unternehmen?
              </StyledButtonOutlined>
            </Grid>
            <Grid item xs={12}>
              <StyledButton
                fullWidth
                onClick={() => dispatch(selectView('newRequest'))}
              >
                Neue Anfrage erstellen.
              </StyledButton>
            </Grid>
          </Grid>

          <SuggestBrand
            open={suggestBrandVisible}
            setOpenSuggestBrand={setSuggestBrandVisible}
          />
        </CardContent>
      </Card>
    </Grid>
  );

  const getUpdateCard = () => (
    <Grid item lg={7} xs={12}>
      <Card className={classes.cardWithShadow}>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.title}>
            {updateInfo.message}
          </Typography>
        </CardContent>
        <CardActions>
          {updateInfo.latest_version && (
            <Link
              className={classes.button}
              href={
                process.platform === 'darwin'
                  ? updateInfo.url_macos
                  : updateInfo.url_windows
              }
              download
            >
              Download Version {updateInfo.latest_version}
            </Link>
          )}
        </CardActions>
      </Card>
    </Grid>
  );

  const getRatingCard = () => (
    <Grid item lg={5} xs={12}>
      <Card className={classes.card}>
        <CardContent
          className={`${classes.cardContent} ${classes.alignItemsFlexStart}`}
        >
          <form className={classes.ratingForm}>
            <label className={classes.ratingFormLabel}>Bewerte uns:</label>
            <StyledRating
              value={rating}
              precision={1}
              name={'rating'}
              className={classes.styledRating}
              onChange={(e, value) => value && dispatch(startRating(value))}
            ></StyledRating>
          </form>
        </CardContent>
      </Card>
    </Grid>
  );

  const getFeedbackForm = () => (
    <Grid item lg={5} xs={12}>
      <Card className={classes.card}>
        <CardContent
          className={`${classes.cardContent} ${classes.alignItemsFlexStart}`}
        >
          <form className={classes.fullWidth}>
            <label>Wir freuen uns über dein Feedback:</label>
            <TextField
              multiline
              rows={2}
              rowsMax={5}
              InputProps={{
                disableUnderline: true
              }}
              className={classes.feedback}
              placeholder="Deine Nachricht an uns..."
              value={feedbackMessage}
              onChange={e => setFeedbackMessage(e.target.value)}
            ></TextField>
          </form>

          <StyledButtonOutlined
            className={classes.sendButton}
            onClick={() => dispatch(startFeedback(feedbackMessage))}
            disabled={!feedbackMessage}
          >
            Senden
          </StyledButtonOutlined>
        </CardContent>
      </Card>
    </Grid>
  );

  const getWelcomeMessage = () =>
    showWelcomeMessage && (
      <Backdrop open={showWelcomeMessage} className={classes.backdrop}>
        <OkDialog
          title={localization.WELCOME_MESSAGE}
          description={localization.WELCOME_CONTENT}
          closeText={localization.WELCOME_BUTTON}
          onClose={handleWelomeMessage}
        />
      </Backdrop>
    );

  const getRatingMessage = () =>
    showRatingMessage && (
      <Backdrop open={showRatingMessage} className={classes.backdrop}>
        <OkDialog
          title={localization.RATING_TITLE}
          description={localization.RATING_CONTENT}
          closeText={localization.RATING_BUTTON}
          onClose={() => dispatch(clearShowRating())}
        />
      </Backdrop>
    );

  const getFeedbackMessage = () =>
    showFeedbackMessage && (
      <Backdrop open={showFeedbackMessage} className={classes.backdrop}>
        <OkDialog
          title={localization.FEEDBACK_MESSAGE}
          description={localization.FEEDBACK_CONTENT}
          closeText={localization.RATING_BUTTON}
          onClose={() => dispatch(clearShowFeedback())}
        />
      </Backdrop>
    );

  return (
    <React.Fragment>
      <Container className={classes.root}>
        <Grid container spacing={5}>
          <Grid item xs={12} className={classes.email}>
            <UserIcon />
            {activeMail}
          </Grid>
          {updateInfo.message ? getUpdateCard() : getPlaceholder()}
          {getActionCard()}
          {isDesktop && (
            <Grid item lg={7}>
              {' '}
            </Grid>
          )}
          {getRatingCard()}
          {isDesktop && (
            <Grid item lg={7}>
              {' '}
            </Grid>
          )}
          {getFeedbackForm()}
        </Grid>
      </Container>

      {getWelcomeMessage()}
      {getRatingMessage()}
      {getFeedbackMessage()}
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => ({
  updateInfo: state.homeState.updateInfo,
  showWelcomeMessage: state.showWelcomeMessage,
  emailAccount: getPrimaryEmail(state),
  totalDomains: getTotalDomains(state),
  showRatingMessage: getShowRatingMessage(state),
  showFeedbackMessage: getShowFeedbackMessage(state),
  rating: getRating(state)
});

const dispatchToProps = {
  setWelcomeMessageToggle
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(HomePage);
