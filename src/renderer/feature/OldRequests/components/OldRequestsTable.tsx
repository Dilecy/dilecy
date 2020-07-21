import React from 'react';
import CustomDataTable from '@dilecy/shared/components/CustomDataTable';
import { localization } from '@dilecy/shared';

import { OldRequest } from '../interface';
import moment from 'moment';
import { SNOOZE_DAYS, SNOOZE_LIMIT } from '@dilecy/shared';
import { Action } from 'material-table';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { customTheme } from '@dilecy/shared/styles/theme';
import { StyledButton, StyledButtonOutlined } from '@dilecy/shared';

interface OldRequestTableProps {
  oldRequestsData: OldRequest[];
  onResponse: (
    responseType: 'affirmative' | 'negative'
  ) => (rowData: OldRequest) => void;
  onSnooze: (rowData: OldRequest) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonGreen: {
    backgroundColor: '#00e676',
    color: 'white',
    margin: '0.5rem',
    textTransform: 'capitalize',
    fontSize: customTheme.fontSizeBodySmall,
    '&:hover': { backgroundColor: '#00a152' }
  },
  buttonRed: {
    backgroundColor: customTheme.colorWarning,
    color: 'white',
    margin: '0.5rem',
    textTransform: 'capitalize',
    fontSize: customTheme.fontSizeBodySmall,
    '&:hover': { backgroundColor: '#b2102f' }
  },
  buttonGray: {
    margin: '0.5rem',
    textTransform: 'capitalize',
    fontSize: customTheme.fontSizeBodySmall
  }
}));

const OldRequestsTable: React.FC<OldRequestTableProps> = ({
  oldRequestsData,
  onSnooze,
  onResponse
}) => {
  const classes = useStyles();
  return (
    <CustomDataTable
      title="Alte Anfragen"
      selection={false}
      columns={[
        { title: localization.BRAND_NAME, field: 'brandName' },
        {
          title: localization.DATE,
          field: 'dateTimeCreated',
          filtering: false,
          customSort: (a, b) =>
            a.dateTimeCreatedMoment.unix() - b.dateTimeCreatedMoment.unix()
        },
        {
          title: localization.REQUEST_GROUP_TYPE,
          field: 'requestGroupType',
          lookup: {
            access: localization.REQUEST_GROUP_TYPE_ACCESS,
            rejection: localization.REQUEST_GROUP_TYPE_REJECTION,
            deletion: localization.REQUEST_GROUP_TYPE_DELETION
          }
        },
        {
          title: localization.PROGRESS,
          field: 'progress',
          filtering: false,
          customSort: (a, b) =>
            moment(a.dueDate, 'DD.MM.YYYY').unix() -
            moment(b.dueDate, 'DD.MM.YYYY').unix()
        },
        {
          title: localization.REQUEST_STATE,
          field: 'visibleState',
          lookup: {
            [localization.VISIBLE_STATE_DUE]: localization.VISIBLE_STATE_DUE,
            [localization.VISIBLE_STATE_RUNNING]:
              localization.VISIBLE_STATE_RUNNING,
            [localization.VISIBLE_STATE_SNOOZED]:
              localization.VISIBLE_STATE_SNOOZED,
            [localization.VISIBLE_STATE_SUCCESSFUL]:
              localization.VISIBLE_STATE_SUCCESSFUL,
            [localization.VISIBLE_STATE_FAILED]:
              localization.VISIBLE_STATE_FAILED
          }
        }
      ]}
      rows={oldRequestsData}
      components={{
        Action: (props: { action: Action<OldRequest>; data: OldRequest }) => {
          const { requestGroupState, snoozeCount, isDue } = props.data;
          if (props.action.icon === 'accept') {
            return (
              <>
                {requestGroupState === 'inProgress' && (
                  <StyledButton
                    onClick={() => onResponse('affirmative')(props.data)}
                    className={classes.buttonGreen}
                  >
                    {localization.ACTION_ACCEPT}
                  </StyledButton>
                )}
              </>
            );
          } else if (props.action.icon === 'reject') {
            return (
              <>
                {requestGroupState === 'inProgress' && isDue && (
                  <StyledButton
                    onClick={() => onResponse('negative')(props.data)}
                    className={classes.buttonRed}
                  >
                    {localization.ACTION_REJECT}
                  </StyledButton>
                )}
              </>
            );
          } else {
            return (
              <>
                {requestGroupState === 'inProgress' &&
                  isDue &&
                  snoozeCount < SNOOZE_LIMIT && (
                    <StyledButtonOutlined
                      color="primary"
                      onClick={() => onSnooze(props.data)}
                      className={classes.buttonGray}
                    >
                      {localization.ACTION_SNOOZE}
                    </StyledButtonOutlined>
                  )}
              </>
            );
          }
        }
      }}
      actions={[
        {
          icon: 'accept',
          tooltip: localization.ACTION_ACCEPT,
          onClick: () => undefined
        },
        {
          icon: 'reject',
          tooltip: localization.ACTION_REJECT,
          onClick: () => undefined
        },
        {
          icon: 'snooze',
          tooltip: `Für ${SNOOZE_DAYS} Tage zurückstellen`,
          onClick: () => undefined
        }
      ]}
    />
  );
};
export default OldRequestsTable;
