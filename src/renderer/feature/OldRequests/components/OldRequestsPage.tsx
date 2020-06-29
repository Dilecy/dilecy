import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import { RootState } from 'typesafe-actions';
import CustomDataTable from '../../../shared/components/CustomDataTable';
import * as Actions from '../actions';
import { useDueDateStatus } from '../hooks/useDueDateStatus';
import moment from 'moment';
import { localization as localizations } from '../../../shared/localization';
import { getTranslatedRequestGroupType } from '../../../shared/helpers/helper';
import { customTheme } from '../../../shared/styles/theme';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: customTheme.containerWidth + ' !important',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
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
  heading: {
    fontSize: customTheme.fontSizeH1,
    fontWeight: 'bold',
    margin: 0,
    padding: '0.625rem'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '21.875rem'
  },
  colorPrimary: {
    backgroundColor: '#76FF03'
  },
  tooltip: {
    fontSize: customTheme.fontSizeBodySmall,
    '&:hover': { cursor: 'pointer' }
  },
  card: {
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    display: 'flex',
    flex: '1',
    padding: theme.spacing(customTheme.spacing),
    flexDirection: 'column',
    justifyContent: 'center',
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: 'white'
  }
}));

export interface OldRequest {
  brandName: string;
  dateTimeCreated: JSX.Element;
  dateTimeCreatedMoment: moment.Moment;
  requestGroupType: string;
  dueDate: string;
  progress: JSX.Element;
}

const OldRequestsPage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const oldRequests: OldRequest[] = useSelector((state: RootState) =>
    state.oldRequestsState.oldRequests.map(request => {
      const { createdTime, createdDate, dueDate, progress } = useDueDateStatus(
        moment(request.dateTimeCreated),
        30
      );
      return {
        brandName: request.brandName,
        dateTimeCreatedMoment: moment(request.dateTimeCreated),
        dateTimeCreated: (
          <Tooltip title={createdTime} className={classes.tooltip}>
            <span>{createdDate}</span>
          </Tooltip>
        ),
        requestGroupType: getTranslatedRequestGroupType(
          request.requestGroupType
        ),
        dueDate: dueDate,
        progress: (
          <Tooltip title={dueDate} className={classes.tooltip}>
            <LinearProgress
              variant="determinate"
              value={progress}
              className={progress === 100 ? classes.colorPrimary : undefined}
            />
          </Tooltip>
        )
      };
    })
  );
  const isLoading = useSelector(
    (state: RootState) => state.oldRequestsState.loading
  );

  React.useEffect(() => {
    dispatch(Actions.oldRequestsRequested());
  }, []);

  return (
    <Container className={classes.root}>
      <div className={classes.nav}>
        <h1 className={classes.heading}>{localizations.OLD_REQUESTS}</h1>
      </div>

      <div className={classes.card}>
        {isLoading && (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        )}
        {!isLoading && (
          <CustomDataTable
            title="Alte Anfragen"
            columns={[
              { title: localizations.BRAND_NAME, field: 'brandName' },
              {
                title: localizations.DATE,
                field: 'dateTimeCreated',
                customSort: (a, b) =>
                  a.dateTimeCreatedMoment.unix() -
                  b.dateTimeCreatedMoment.unix()
              },
              {
                title: localizations.REQUEST_GROUP_TYPE,
                field: 'requestGroupType'
              },
              {
                title: localizations.PROGRESS,
                field: 'progress',
                customSort: (a, b) =>
                  moment(a.dueDate, 'DD.MM.YYYY').unix() -
                  moment(b.dueDate, 'DD.MM.YYYY').unix()
              }
            ]}
            rows={oldRequests}
          />
        )}
      </div>
    </Container>
  );
};

export default OldRequestsPage;
