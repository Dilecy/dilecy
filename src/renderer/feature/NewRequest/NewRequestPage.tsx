import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'typesafe-actions';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles, Theme } from '@material-ui/core/styles';

import ChooseRequestTypePage from './components/ChooseRequestTypeStep';
import SelectBrandsPage from './components/SelectBrandsStep';
import RequestTemplatePage from './components/RequestTemplateStep';
import SummaryPage from './components/SummaryStep';
import SelectRecommendedBrandsPage from './components/SelectRecommendedBrandsStep';

import { RequestGroupType } from '../../model/clientModel';
import { RequestPageSelection, NewRequestStatus } from '../../store/stateModel';
import { useTracker } from '../../core/dependencies';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import {
  cancelNewRequest,
  selectNewRequestStep,
  newRequestDone
} from './actions';
import { selectPage, selectView } from '../../core/actions';
import StyledButton from '../../shared/components/StyledButton';
import { customTheme } from '../../shared/styles/theme';
import CustomStepIcon from '../../shared/components/StyledStepIcon';
import CompleteProfileModal from '../CreateProfile/components/CompleteProfileModal';
import { localization } from '../../shared/localization';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: customTheme.containerWidth,
    padding: 0,
    flex: '1',
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column'
  },
  nav: {
    borderRadius: '9999rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 0.75rem',
    marginBottom: theme.spacing(customTheme.spacing),
    boxShadow: 'none',
    backgroundColor: 'white',
    maxHeight: '3.5rem',
    height: '3.5rem'
  },
  button: {
    backgroundColor: 'white',
    color: customTheme.colorPrimary,
    fontWeight: 'bold'
  },
  card: {
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    justifyContent: 'center',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  heading: {
    padding: '0.625rem',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: customTheme.fontSizeH1,
    margin: '0'
  },
  navigationButtons: {
    width: '100%',
    position: 'sticky',
    padding: '0',
    margin: '0 auto',
    textAlign: 'center',
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(customTheme.spacing)
  },
  activePage: {
    height: '100%',
    display: 'flex',
    flex: '1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    '&.full-height .MuiContainer-root': {
      height: '100%',
      marginBottom: 'auto',
      padding: theme.spacing(customTheme.spacing)
    }
  },
  fullWidth: {
    width: '100%'
  },
  stretchContent: {
    alignItems: 'stretch'
  },
  stepper: {
    justifyContent: 'flex-end',
    padding: '0.75rem',

    '& .MuiStepConnector-lineHorizontal': {
      borderTopWidth: '2px'
    },

    '& .MuiStepLabel-label': {
      textAlign: 'center'
    },
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main
    },
    '& .MuiStepIcon-text': {
      fontSize: `${customTheme.fontSizeBodyLarge} !important`
    },
    '& .MuiStepConnector-root': {
      maxWidth: 80
    },
    [theme.breakpoints.down('lg')]: {
      '& .MuiStepConnector-root': {
        display: 'none'
      }
    },
    [theme.breakpoints.up('lg')]: {
      '& .MuiStepConnector-root': {
        display: 'block'
      }
    }
  }
}));

const pages: RequestPageSelection[] = [
  'choose',
  'recommendation',
  'select',
  'text',
  'summary'
];

const pageTitles = {
  choose: 'Anfragetyp',
  recommendation: 'Marken Vorschläge',
  select: 'Marken auswählen',
  text: 'Anfrage Text',
  summary: 'Zusammenfassung'
};

const viewTitle = {
  access: 'Datenauskunft',
  rejection: 'Widerspruch',
  deletion: 'Datenlöschung',
  portability: 'Anfrage auf Datenportabilität'
};

interface ActivePageProps {
  selectedPage: RequestPageSelection;
  onBrowserHistoryConsentRevoked: () => void;
}
const ActivePage = ({
  selectedPage,
  onBrowserHistoryConsentRevoked
}: ActivePageProps) => {
  switch (selectedPage) {
    case 'choose':
      return <ChooseRequestTypePage />;
    case 'select':
      return <SelectBrandsPage />;
    case 'recommendation':
      return (
        <SelectRecommendedBrandsPage
          onBrowserHistoryConsentRevoked={onBrowserHistoryConsentRevoked}
        />
      );
    case 'text':
      return <RequestTemplatePage />;
    case 'summary':
      return <SummaryPage />;
    default:
      return <Typography color="error">{selectedPage}</Typography>;
  }
};

interface Props {
  requestType: RequestGroupType;
  status: NewRequestStatus;
  selectPage: typeof selectPage;
  selectNewRequestStep: typeof selectNewRequestStep;
  cancelNewRequest: typeof cancelNewRequest;
  selectView: typeof selectView;
  activeStep: RequestPageSelection;
  validSteps: Partial<Record<RequestPageSelection, boolean>>;
  newRequestDone: typeof newRequestDone;
}

const NewRequestView = (props: Props) => {
  const {
    requestType,
    status,
    selectNewRequestStep,
    cancelNewRequest,
    selectView,
    activeStep,
    validSteps,
    selectPage,
    newRequestDone
  } = props;
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const cancelRequestTitle = 'Anfrage abbrechen?';
  const pageIndex = pages.findIndex(p => p === activeStep);
  const tracker = useTracker();

  const classes = useStyles();
  const cancelRequest = () => {
    cancelNewRequest();
    setDialogOpen(false);
    selectPage({ newRequest: 'choose' });
    selectNewRequestStep('choose');
    selectView('home');
  };
  const confirmCancelRequest = () => {
    setDialogOpen(true);
  };
  const trySelectPage = (page: RequestPageSelection) => {
    //TODO: Check for error on page
    selectPage({ newRequest: page });
    selectNewRequestStep(page);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleOk = () => {
    cancelRequest();
  };

  const isSummaryPage = pageIndex === pages.length - 1;

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Card className={classes.nav}>
          <h1 className={classes.heading}>{viewTitle[requestType]}</h1>

          <div className={classes.fullWidth}>
            <Stepper
              className={classes.stepper}
              connector={<StepConnector></StepConnector>}
              nonLinear
              activeStep={pageIndex}
            >
              {pages.map((page, index) => (
                <Step
                  key={page}
                  className={pageIndex === index ? 'active' : undefined}
                  completed={validSteps[page]}
                >
                  <StepLabel
                    StepIconComponent={CustomStepIcon}
                    onClick={() =>
                      validSteps[page] ? trySelectPage(pages[index]) : {}
                    }
                  >
                    {pageIndex === index ? pageTitles[page] : null}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </Card>

        <Card className={classes.card}>
          <div
            className={`${classes.activePage} ${
              // Table needs to be fixed to top and full-height instead of centered
              // to avoid jumping when only few elements are shown for some pages
              activeStep === 'select' ||
              activeStep === 'text' ||
              activeStep === 'recommendation' ||
              activeStep === 'summary'
                ? classes.stretchContent
                : ''
            }`}
          >
            <ActivePage
              selectedPage={activeStep}
              onBrowserHistoryConsentRevoked={() => {
                trySelectPage(pages[2]); // goto brand selection step
              }}
            />
          </div>
        </Card>

        <div className={classes.navigationButtons}>
          <StyledButton
            color="default"
            className={classes.button}
            style={{
              visibility:
                pageIndex === 0 || status === 'sent' ? 'hidden' : 'visible'
            }}
            onClick={() => trySelectPage(pages[pageIndex - 1])}
          >
            {localization.BACK}
          </StyledButton>
          <StyledButton
            color="default"
            className={classes.button}
            onClick={() => confirmCancelRequest()}
            style={{
              visibility: status === 'sent' ? 'hidden' : 'visible'
            }}
          >
            {localization.CANCEL}
          </StyledButton>

          {isSummaryPage && (
            <StyledButton
              disabled={status !== 'sent'}
              style={{
                fontWeight: 'bold'
              }}
              onClick={() => newRequestDone()}
            >
              Fertig
            </StyledButton>
          )}

          {!isSummaryPage && (
            <StyledButton
              disabled={!validSteps[activeStep]}
              style={{
                fontWeight: 'bold'
              }}
              onClick={() => {
                if (pageIndex === 0) {
                  tracker.event('new request', 'started', requestType);
                }
                trySelectPage(pages[pageIndex + 1]);
              }}
            >
              {localization.NEXT}
            </StyledButton>
          )}
        </div>
      </div>
      <CompleteProfileModal></CompleteProfileModal>

      {/* Confirm dialog */}
      <ConfirmDialog
        title={cancelRequestTitle}
        handleCancel={handleCancel}
        handleOk={handleOk}
        isOpen={dialogOpen}
      >
        <Typography gutterBottom>
          Bist Du sicher, dass Du abbrechen möchtest?
        </Typography>
      </ConfirmDialog>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => ({
  requestType: state.newRequestState.requestType,
  status: state.newRequestState.status,
  activeStep: state.newRequestState.activeStep,
  validSteps: state.newRequestState.validSteps
});

const dispatchToProps = {
  cancelNewRequest,
  selectNewRequestStep,
  selectView,
  selectPage,
  newRequestDone
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(NewRequestView);
