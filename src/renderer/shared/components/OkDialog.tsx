import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { StyledButton } from './StyledButton';
import { customTheme } from '../styles/theme';

interface OkDialogProps {
  onClose: () => void;
  title: string;
  description: string;
  closeText: string;
}

const useStylesOkDialog = makeStyles((theme: Theme) => ({
  card: { maxWidth: '50%' },
  welcomeMessage: {
    padding: '2rem',
    textAlign: 'center',
    minHeight: '10rem',
    borderRadius: customTheme.borderRadius,
    overflow: 'hidden',
    '& h4': {
      fontSize: '1.5rem'
    },
    '& p': {
      padding: '1rem 0',
      fontSize: '1rem'
    }
  }
}));

const OkDialog: React.FC<OkDialogProps> = (props: OkDialogProps) => {
  const classes = useStylesOkDialog();
  return (
    <Card className={classes.card}>
      <CardContent className={classes.welcomeMessage}>
        <Typography variant="h4">{props.title}</Typography>

        <Typography>{props.description}</Typography>

        <br />
        <StyledButton
          aria-label="close-welcome-message"
          onClick={props.onClose}
        >
          {props.closeText}
        </StyledButton>
      </CardContent>
    </Card>
  );
};

export { OkDialog };
