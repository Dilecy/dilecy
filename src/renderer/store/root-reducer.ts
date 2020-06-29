import { combineReducers } from 'redux';
import {
  consentReducer,
  createProfileReducer
} from '../feature/CreateProfile/reducer';
import { loginReducer } from '../feature/Login/reducer';
import { homeStateReducer } from '../feature/Home/reducer';
import { newRequestStateReducer } from '../feature/NewRequest/reducer';
import { oldRequestsStateReducer } from '../feature/OldRequests/reducer';
import {
  appInfoReducer,
  alertReducer,
  pageSelectionReducer,
  viewSelectionReducer,
  welcomeMessageReducer,
  serverDataReducer
} from '../core/reducer';

const rootReducer = combineReducers({
  appInfo: appInfoReducer,
  alerts: alertReducer,
  consentStatus: consentReducer,
  createProfileStatus: createProfileReducer,
  loginStatus: loginReducer,
  homeState: homeStateReducer,
  newRequestState: newRequestStateReducer,
  oldRequestsState: oldRequestsStateReducer,
  selectedPage: pageSelectionReducer,
  selectedView: viewSelectionReducer,
  showWelcomeMessage: welcomeMessageReducer,
  serverData: serverDataReducer
});
export default rootReducer;
