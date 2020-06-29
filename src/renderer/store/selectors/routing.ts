import { createSelector } from 'reselect';
import { RootState } from 'typesafe-actions';

const getPageSelection = (state: RootState) => state.selectedPage;
const getViewSelection = (state: RootState) => state.selectedView;

export const getCurrentPage = createSelector(
  getPageSelection,
  getViewSelection,
  (page, view) => {
    switch (view) {
      case 'newRequest':
        return page['newRequest'];
      case 'login':
        return page['login'];
      default:
        return view;
    }
  }
);
