import { withStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import { customTheme } from '../styles/theme';
interface Props {
  content: string;
}

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#D0D0D0',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: '21.875rem',
    fontSize: customTheme.fontSizeBodySmall,
    border: '1px solid #dadde9',
    padding: '1rem',
    borderRadius: customTheme.borderRadius,

    '& .MuiTooltip-arrow': {
      fontSize: '1rem',
      color: '#D0D0D0'
    },
    '& .MuiSvgIcon-root': {
      width: '2.125rem',
      height: '2.125rem'
    }
  }
}))(Tooltip);

const CustomTooltip: React.FC<Props> = ({ content }) => {
  return (
    <HtmlTooltip title={content} arrow placement="right">
      <InfoIcon color="action" />
    </HtmlTooltip>
  );
};

export default CustomTooltip;
