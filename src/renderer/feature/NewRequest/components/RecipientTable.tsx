import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drafts from '@material-ui/icons/Drafts';
import Email from '@material-ui/icons/Email';
import Done from '@material-ui/icons/Done';
import Close from '@material-ui/icons/Close';

import { useDispatch, useSelector } from 'react-redux';
import { SendStatus, Recipient } from '../../../store/stateModel';
import {
  toggleBrandSelected,
  toggleRecommendedBrandSelected
} from '../actions';
import { RootState } from 'typesafe-actions';

interface StatusProps {
  status: SendStatus;
}
const Status = (props: StatusProps) => {
  switch (props.status) {
    case 'selected':
      return <Drafts />;
    case 'prepared':
      return <Email />;
    case 'sent':
      return <Done />;
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      maxHeight: '31.25rem',
      overflow: 'auto'
    },
    table: {
      '& td:first-child, th:first-child': {
        width: '1.25rem'
      }
    },
    tableHeader: {
      '& th': {
        fontWeight: 'bold'
      },
      display: 'table',
      width: '100%',
      tableLayout: 'fixed'
    },
    tableBody: {
      ['& tr:nth-child(even)']: {
        backgroundColor: '#f3f3f3'
      },
      display: 'block',
      maxHeight: '21.875rem',
      overflowY: 'scroll',
      '& tr': {
        display: 'table',
        width: '100%',
        tableLayout: 'fixed'
      }
    }
  })
);

interface Props {
  recipients: Recipient[];
}

const RecipientTable = (props: Props) => {
  const classes = useStyles();
  const { recipients } = props;
  const newRequestState = useSelector(
    (state: RootState) => state.newRequestState
  );
  const selectedBrands = newRequestState.brandSelection;
  const dispatch = useDispatch();

  const handleRemoveItem = (event: { id: number; selected: boolean }) => {
    dispatch(toggleBrandSelected(event));
    dispatch(
      toggleRecommendedBrandSelected({
        id: event.id,
        selected: event.selected
      })
    );
  };
  return (
    <List className={classes.root}>
      {recipients
        .filter(entry => entry.brand)
        .map(entry => {
          const labelId = `checkbox-list-label-${entry.brand.id}`;

          return (
            <ListItem key={entry.brand.id} role={undefined} dense button>
              <ListItemIcon>
                <Status status={entry.status} />
              </ListItemIcon>
              <ListItemText id={labelId} primary={entry.brand.name} />
              <ListItemSecondaryAction
                onClick={() =>
                  handleRemoveItem({
                    id: entry.brand.id,
                    selected: !selectedBrands[entry.brand.id]
                  })
                }
              >
                <IconButton edge="end" aria-label="comments">
                  <Close />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
    </List>
  );
};

export default RecipientTable;
