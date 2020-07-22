import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { Dependencies } from '@dilecy/core';

import { RootState } from 'typesafe-actions';
import rootReducer from '../root-reducer';
import { rootEpic, configureEpicMiddleware } from '../root-epic';

//Simplifies testing
declare global {
  interface Window {
    deps: Dependencies;
  }
}

export const configureStore = (
  dependencies: Dependencies,
  preloadedState?: RootState
) => {
  const epicMiddleware = configureEpicMiddleware(dependencies);
  const enhancer = composeWithDevTools(applyMiddleware(epicMiddleware));
  const store = createStore(rootReducer, preloadedState, enhancer);
  dependencies.tracker.setIdResolver(
    () => store.getState().consentStatus.tracking
  );
  epicMiddleware.run(rootEpic);
  /*** WARNING: Only enable during testing
  window.deps = dependencies;
  */
  return store;
};
