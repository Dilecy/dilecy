import React from 'react';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { ViewSelection } from '../../store/stateModel';
import LoginPage from '../../feature/Login/LoginPage';
import ProfileSettingsPage from '../../feature/ProfileSettings/components/ProfileSettingsPage';
import OldRequestsPage from '../../feature/OldRequests/components/OldRequestsPage';
import HelpPage from '../../feature/Help/HelpPage';
import HomePage from '../../feature/Home/HomePage';
import NewRequestPage from '../../feature/NewRequest/NewRequestPage';
import { RootState } from 'typesafe-actions';

interface Props {
  selectedView: ViewSelection;
}
/**
 * This component is responsible for switching between pages/screens in the app
 * @param props
 */
const PageRouter = (props: Props) => {
  switch (props.selectedView) {
    case 'login':
      return <LoginPage />;
    case 'home':
      return <HomePage />;
    case 'newRequest':
      return <NewRequestPage />;
    case 'oldRequests':
      return <OldRequestsPage />;
    case 'settings':
      return <ProfileSettingsPage />;
    case 'help':
      return <HelpPage />;
    default:
      return <Typography color="error">{props.selectedView}</Typography>;
  }
};

const mapStateToProps = (state: RootState) => ({
  selectedView: state.selectedView
});

export default connect(mapStateToProps)(PageRouter);
