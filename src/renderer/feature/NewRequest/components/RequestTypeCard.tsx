import React from 'react';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';
import { RequestGroupType } from '@dilecy/model/clientModel';
import { CustomTooltip } from '@dilecy/shared';
import { selectRequestType } from '../actions';
import { customTheme } from '@dilecy/shared/styles/theme';
import { RootState } from 'typesafe-actions';

const cardWidth = '21.875rem';
const useStyles = makeStyles(theme => ({
  chosen: {
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow,
    width: cardWidth
  },
  card: {
    width: cardWidth,
    borderRadius: customTheme.borderRadius,
    boxShadow: customTheme.shadow
  },
  title: {
    textAlign: 'center',
    fontSize: customTheme.fontSizeH2
  },
  button: {
    width: '100%'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center'
  },
  checkbox: {
    width: '1rem',
    height: '1rem',
    borderRadius: '9999rem',
    overflow: 'hidden',
    backgroundColor: theme.palette.grey[300],
    border: `1px solid ${theme.palette.grey[700]}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&.checked': {
      backgroundColor: theme.palette.primary.main
    }
  },
  clearIcon: {
    width: '1rem',
    height: '1rem',
    color: 'white'
  }
}));

interface Props {
  requestGroupType: RequestGroupType;
  chosenRequestType: RequestGroupType;
  label: string;
  selectRequestType: typeof selectRequestType;
  tooltipContent: string;
  className?: string;
}

const RequestTypeCard: React.FC<Props> = ({
  requestGroupType,
  chosenRequestType,
  tooltipContent,
  selectRequestType,
  label,
  className = ''
}) => {
  const classes = useStyles();
  const isSelected = requestGroupType === chosenRequestType;
  const bodyClass = `${
    isSelected ? classes.chosen : classes.card
  } ${className}`;

  return (
    <Card className={bodyClass}>
      <ButtonBase
        className={classes.button}
        onClick={() => selectRequestType(requestGroupType)}
      >
        <CardContent className={classes.content}>
          <div
            className={`
            ${classes.checkbox} 
            ${isSelected && 'checked'}
          `}
          >
            {isSelected && <ClearIcon className={classes.clearIcon} />}
          </div>
          <Typography className={classes.title}>{label}</Typography>
          <CustomTooltip content={tooltipContent} />
        </CardContent>
      </ButtonBase>
    </Card>
  );
};

const mapStateToProps = (state: RootState) => ({
  chosenRequestType: state.newRequestState.requestType
});

const dispatchToProps = {
  selectRequestType
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(RequestTypeCard);
