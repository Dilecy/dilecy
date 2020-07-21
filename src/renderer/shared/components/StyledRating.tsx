import Rating from '@material-ui/lab/Rating';
import { withStyles } from '@material-ui/core/styles';

const StyledRating = withStyles(theme => ({
  iconFilled: {
    color: theme.palette.primary.main
  },
  iconHover: {
    color: theme.palette.primary.main
  }
}))(Rating);

export { StyledRating };
