import React from 'react';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { AuthQAItem } from '../../../store/stateModel';
import { setAuthAnswerText } from '../actions';

interface Props {
  authQA: AuthQAItem[];
  setAuthAnswerText: typeof setAuthAnswerText;
}

const AuthenticationAnswerStep = (props: Props) => {
  const { authQA, setAuthAnswerText } = props;
  return (
    <Container>
      <Typography>Authentication</Typography>
      <List>
        {authQA.map(a => {
          const numBrands = a.brandNames.length;
          const extraBrands = numBrands > 1 ? ` + (${numBrands - 1})` : '';
          const brands = `${a.brandNames[0]} ${extraBrands}`;
          return (
            <ListItem key={a.authA.id}>
              <Typography>{brands}</Typography>
              <Typography>{a.authA.question}</Typography>
              <TextField
                value={a.authA.answer}
                onChange={e =>
                  setAuthAnswerText({ id: a.authA.id, text: e.target.value })
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

const mapStateToProps = () => ({
  authQA: [] //TODO: replace with selector when available
});

const dispatchToProps = {
  setAuthAnswerText
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(AuthenticationAnswerStep);
