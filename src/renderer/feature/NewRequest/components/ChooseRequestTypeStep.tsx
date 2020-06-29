import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import RequestTypeCard from './RequestTypeCard';
import {
  getOriginalRequestTemplate,
  isEmailTemplatesListLoading
} from '../selectors';
import { validateNewRequestStep, emailTemplatesRequested } from '../actions';
import { RootState } from 'typesafe-actions';
import { localization } from '../../../shared/localization';

interface Props {
  templateMissing: boolean;
  validateNewRequestStep: typeof validateNewRequestStep;
  emailTemplatesRequested: typeof emailTemplatesRequested;
  isLoading: boolean;
}

const useStyles = makeStyles({
  loading: {
    display: 'flex',
    height: '25rem',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const tooltipDataInfo = localization.TOOLTIP_DATA_INFO;

const tooltipDataDeletion = localization.TOOLTIP_DATA_DELETION;

const tooltipContradiction = localization.TOOLTIP_DATA_CONTRADICTION;

const ChooseRequestTypeStep = (props: Props) => {
  const classes = useStyles();
  const {
    templateMissing,
    validateNewRequestStep,
    emailTemplatesRequested,
    isLoading
  } = props;

  React.useEffect(() => {
    validateNewRequestStep({ choose: true });
    if (templateMissing) {
      emailTemplatesRequested(1);
    }
  }, []);

  return (
    <div>
      {isLoading && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <>
          <Collapse in={templateMissing}>
            <Typography color="error">
              Für den aktuell gewählten Anfragetyp steht derzeit kein Mustertext
              zur verfügung. Bitte kontaktieren Sie den Dilecy Support.
            </Typography>
          </Collapse>
          <Grid container direction="column" spacing={3} alignItems="center">
            <Grid item xs={8} lg={6}>
              <RequestTypeCard
                requestGroupType="access"
                label="Datenauskunft"
                tooltipContent={tooltipDataInfo}
              />
            </Grid>
            <Grid item xs={8} lg={6}>
              <RequestTypeCard
                requestGroupType="deletion"
                label="Datenlöschung"
                tooltipContent={tooltipDataDeletion}
              />
            </Grid>
            <Grid item xs={8} lg={6}>
              <RequestTypeCard
                requestGroupType="rejection"
                label="Widerspruch"
                tooltipContent={tooltipContradiction}
              />
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  templateMissing: getOriginalRequestTemplate(state) === undefined,
  isLoading: isEmailTemplatesListLoading(state)
});

const dispatchToProps = {
  validateNewRequestStep,
  emailTemplatesRequested
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(ChooseRequestTypeStep);
