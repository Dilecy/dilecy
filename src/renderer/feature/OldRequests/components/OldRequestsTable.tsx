import React from 'react';
import CustomDataTable from '../../../shared/components/CustomDataTable';
import { localization as localizations } from '../../../shared/localization';

import { OldRequest } from '../interface';
import moment from 'moment';
import { SNOOZE_DAYS, SNOOZE_LIMIT } from '../../../shared/utils/environment';
import { Action } from 'material-table';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { customTheme } from '../../../shared/styles/theme';
import StyledButton from '../../../shared/components/StyledButton';
import StyledButtonOutlined from '../../../shared/components/StyledButtonOutlined';

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
        { title: localizations.BRAND_NAME, field: 'brandName' },
        {
          title: localizations.DATE,
          field: 'dateTimeCreated',
          filtering: false,
          customSort: (a, b) =>
            a.dateTimeCreatedMoment.unix() - b.dateTimeCreatedMoment.unix()
        },
        {
          title: localizations.REQUEST_GROUP_TYPE,
          field: 'requestGroupType',
          lookup: {
            access: localizations.REQUEST_GROUP_TYPE_ACCESS,
            rejection: localizations.REQUEST_GROUP_TYPE_REJECTION,
            deletion: localizations.REQUEST_GROUP_TYPE_DELETION
          }
        },
        {
          title: localizations.PROGRESS,
          field: 'progress',
          filtering: false,
          customSort: (a, b) =>
            moment(a.dueDate, 'DD.MM.YYYY').unix() -
            moment(b.dueDate, 'DD.MM.YYYY').unix()
        },
        {
          title: localizations.REQUEST_STATE,
          field: 'visibleState',
          lookup: {
            [localizations.VISIBLE_STATE_DUE]: localizations.VISIBLE_STATE_DUE,
            [localizations.VISIBLE_STATE_RUNNING]:
              localizations.VISIBLE_STATE_RUNNING,
            [localizations.VISIBLE_STATE_SNOOZED]:
              localizations.VISIBLE_STATE_SNOOZED,
            [localizations.VISIBLE_STATE_SUCCESSFUL]:
              localizations.VISIBLE_STATE_SUCCESSFUL,
            [localizations.VISIBLE_STATE_FAILED]:
              localizations.VISIBLE_STATE_FAILED
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
                    {localizations.ACTION_ACCEPT}
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
                    {localizations.ACTION_REJECT}
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
                      {localizations.ACTION_SNOOZE}
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
          tooltip: localizations.ACTION_ACCEPT,
          onClick: () => undefined
        },
        {
          icon: 'reject',
          tooltip: localizations.ACTION_REJECT,
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
