import { RootState } from 'typesafe-actions';
import { createSelector } from 'reselect';
import { templateFields } from '../../store/util/templateFields';
import { mapIdMap } from '../../store/util/idMap';

const getBrands = (state: RootState) => state.newRequestState.brands;
const getBrandSelection = (state: RootState) =>
  state.newRequestState.brandSelection;
const getRecommendedBrandsById = (state: RootState) =>
  state.newRequestState.recommendedBrands;
const getEmailTemplates = (state: RootState) =>
  state.newRequestState.emailTemplates;

const getRequestType = (state: RootState) => state.newRequestState.requestType;
const getRequestText = (state: RootState) =>
  state.newRequestState.requestTemplateText;

export const isBrandsListLoading = createSelector(
  getBrands,
  brands => brands.loading
);
export const isEmailTemplatesListLoading = createSelector(
  getEmailTemplates,
  emailTemplates => emailTemplates.loading
);

export const getBrandsByPageNumber = createSelector(
  getBrands,
  brands => brands.paginatedBrands.brandsByPageNumber
);

const getAllBrandsById = createSelector(
  getBrands,
  brands => brands.brandsById
);

export const getEmailTemplatesList = createSelector(
  getEmailTemplates,
  emailTemplates => emailTemplates.emailTemplatesList
);

export const getOriginalRequestTemplate = createSelector(
  getRequestType,
  getEmailTemplatesList,
  (requestType, emailTemplatesList) => emailTemplatesList[`data_${requestType}`]
);

export const getMissingTemplateFields = createSelector(
  getRequestText,
  getOriginalRequestTemplate,
  (text, original) => {
    const orig = original ? templateFields(original.text) : [];
    const current = templateFields(text);
    return orig.filter(f => !current.includes(f));
  }
);

const getRecipientStatus = (state: RootState) =>
  state.newRequestState.recipientStatus;

const getRecipients = createSelector(
  getBrandSelection,
  getAllBrandsById,
  getRecommendedBrandsById,
  (selection, brands, recommendedBrands) => {
    const combined = { ...selection };
    return mapIdMap(combined, { ...brands, ...recommendedBrands });
  }
);

export const getRecipientsWithStatus = createSelector(
  getRecipients,
  getRecipientStatus,
  (recipients, status) =>
    recipients.map((brand, i) => ({
      brand,
      status: status[i] || 'selected'
    }))
);
export const selectBrowserHistory = (state: RootState) =>
  state.newRequestState.browserHistory;

export const browserHistoryData = createSelector(
  selectBrowserHistory,
  browserHistory => browserHistory.browserHistoryData
);
export const isBrowserHistoryLoading = createSelector(
  selectBrowserHistory,
  browserHistory => browserHistory.isFetching
);
