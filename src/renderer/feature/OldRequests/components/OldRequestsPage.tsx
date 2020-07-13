/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { RootState } from 'typesafe-actions';
import * as Actions from '../actions';
import moment from 'moment';
import { RequestGroup } from '../../../model/clientModel';
import { OldRequest } from '../interface';
import OldRequestsTable from './OldRequestsTable';
import Playground from './Playground';
import {
  isDevelopment,
  PROGRESS_COMPLETED
} from '../../../shared/utils/environment';
import { selectOldRequests } from '../selectors';
import { localization as localizations } from '../../../shared/localization';
import { customTheme } from '../../../shared/styles/theme';
import { MRequestGroup } from '../../../model/db/enitities';
import { format } from 'date-fns';

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

export const progressGenerator = (progress: number, dueDate: string) => {
  return (
    <Tooltip title={dueDate}>
      <LinearProgress
        variant="determinate"
        value={progress}
        style={
          progress === PROGRESS_COMPLETED
            ? { backgroundColor: '#76FF03' }
            : undefined
        }
      />
    </Tooltip>
  );
};

const OldRequestsPage: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const oldRequests = useSelector((state: RootState) =>
    selectOldRequests(state)
  );
  const oldRequestsById = useSelector(
    (state: RootState) => state.oldRequestsState.byId
  );
  const oldRequestsTestArray = oldRequestsById.map(id => oldRequests[id]); // For Testing purposes only. To be removed

  const oldRequestsArray = oldRequestsById.map(id => {
    const request = oldRequests[id];
    const requestGroup = new MRequestGroup(
      request.brandId,
      request.brandName,
      request.companyName,
      request.requestGroupType,
      request.dateTimeCreated,
      request.snoozeCount,
      request.state
    );

    const progress = requestGroup.progress;
    const visibleState = requestGroup.visibleState;
    const createdDate = format(requestGroup.createdDate, 'dd.MM.yyyy');
    const createdTime = format(requestGroup.createdDate, 'HH:MM');
    const dueDate = format(requestGroup.dueDate, 'dd.MM.yyyy');
    return {
      id: request.id,
      brandName: request.brandName,
      dateTimeCreatedMoment: moment(request.dateTimeCreated),
      dateTimeCreated: (
        <Tooltip title={createdTime} className={classes.tooltip}>
          <span>{createdDate}</span>
        </Tooltip>
      ),
      snoozeCount: request.snoozeCount || 0,
      requestGroupType: request.requestGroupType,
      dueDate: dueDate,
      requestGroupState: request.state || 'inProgress',
      progress: progressGenerator(progress, dueDate),
      visibleState: visibleState,
      isDue: requestGroup.isDue
    };
  }) as OldRequest[];

  const [oldRequestsData, setOldRequestsData] = React.useState(
    oldRequestsArray
  );
  const isLoading = useSelector(
    (state: RootState) => state.oldRequestsState.loading
  );

  React.useEffect(() => {
    dispatch(Actions.oldRequestsRequested());
  }, []);

  React.useEffect(() => {
    setOldRequestsData(oldRequestsArray);
  }, [oldRequests]);

  const handleResponse = (responseType: 'affirmative' | 'negative') => (
    rowData: OldRequest
  ) => {
    if (responseType === 'affirmative') {
      const requestGroupToUpdate: RequestGroup = {
        ...oldRequests[rowData.id],
        state: 'successful'
      };
      dispatch(Actions.updateRequestGroup(requestGroupToUpdate));
    } else {
      const requestGroupToUpdate: RequestGroup = {
        ...oldRequests[rowData.id],
        state: 'failed'
      };
      dispatch(Actions.updateRequestGroup(requestGroupToUpdate));
    }
  };

  const handleSnooze = (rowData: OldRequest) => {
    const requestGroupToUpdate: RequestGroup = {
      ...oldRequests[rowData.id],
      snoozeCount: +rowData.snoozeCount + 1
    };
    dispatch(Actions.updateRequestGroup(requestGroupToUpdate));
  };

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
          <OldRequestsTable
            oldRequestsData={oldRequestsData}
            onResponse={handleResponse}
            onSnooze={handleSnooze}
          />
        )}

        {/* Only for debugging purposes */}
        {isDevelopment() && <Playground requestGroups={oldRequestsTestArray} />}
      </div>
    </Container>
  );
};

export default OldRequestsPage;
