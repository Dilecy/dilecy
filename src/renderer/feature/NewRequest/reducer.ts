import { NewRequestState } from '../../store/stateModel';
import { createReducer, RootAction } from 'typesafe-actions';
import * as actions from './actions';

export const initialNewRequestState: NewRequestState = {
  activeStep: 'choose',
  browserHistory: {
    consent: false,
    period: 0,
    browserHistoryData: [],
    isFetching: false
  },
  validSteps: {
    choose: false,
    select: false,
    recommendation: false,
    text: false,
    summary: false
  },
  brands: {
    totalCount: 0,
    paginatedBrands: { brandsByPageNumber: {}, hasMore: false },
    loading: true,
    currentPage: 0,
    brandsById: {}
  },
  recommendedBrands: {},
  tags: {},
  emailTemplates: {
    hasMore: false,
    emailTemplatesList: {},
    loading: true
  },
  requestType: 'access',
  brandSelection: {},
  tagFilter: [],
  selectSearchFilter: '',
  requestTemplateText: '',
  requestSubject: '',
  recipientStatus: {},
  isProcessing: false,
  status: 'creating'
};
export const newRequestStateReducer = createReducer<
  NewRequestState,
  RootAction
>(initialNewRequestState)
  .handleAction(actions.selectNewRequestStep, (state, action) => ({
    ...state,
    activeStep: action.payload
  }))
  .handleAction(actions.validateNewRequestStep, (state, action) => ({
    ...state,
    validSteps: { ...state.validSteps, ...action.payload }
  }))
  .handleAction(actions.selectRequestType, (state, action) => ({
    ...state,
    requestType: action.payload
  }))
  .handleAction(actions.brandsRequested, state => ({
    ...state,
    brands: { ...state.brands, loading: true }
  }))
  .handleAction(actions.brandsReceived, (state, action) => {
    const brandsByPageNumber = {
      ...state.brands.paginatedBrands.brandsByPageNumber
    };
    const brandsById = state.brands.brandsById;
    action.payload.brandsList.forEach(brand => (brandsById[brand.id] = brand));

    brandsByPageNumber[action.payload.pageNumber] = action.payload.brandsList;
    const newState = {
      ...state,
      brands: {
        ...state.brands,
        totalCount: action.payload.totalCount,
        loading: false,
        currentPage: action.payload.pageNumber,
        paginatedBrands: {
          brandsByPageNumber,
          hasMore: action.payload.hasMore
        },
        brandsById
      }
    };
    return newState;
  })
  .handleAction(actions.brandsCleared, state => ({
    ...state,
    brands: {
      ...state.brands,
      paginatedBrands: { brandsByPageNumber: Object.assign({}), hasMore: false }
    }
  }))
  .handleAction(actions.recommendedBrandsReceived, (state, action) => {
    return {
      ...state,
      recommendedBrands: action.payload
    };
  })
  .handleAction(actions.tagsReceived, (state, action) => ({
    ...state,
    tags: action.payload
  }))
  .handleAction(actions.emailTemplatesRequested, state => ({
    ...state,
    emailTemplates: { ...state.emailTemplates, loading: true }
  }))
  .handleAction(actions.emailTemplatesReceived, (state, action) => {
    const newState = {
      ...state,
      emailTemplates: {
        ...state.emailTemplates,
        emailTemplatesList: action.payload,
        loading: false
      }
    };
    return newState;
  })
  .handleAction(actions.emailTemplatesRequestFailed, state => ({
    ...state,
    emailTemplates: {
      ...state.emailTemplates,
      loading: false
    }
  }))
  .handleAction(actions.toggleBrandSelected, (state, action) => {
    const brandSelection = { ...state.brandSelection };
    const { id, selected } = action.payload;
    if (selected) {
      if (!brandSelection[id]) {
        brandSelection[id] = { recommended: false };
      }
    } else {
      delete brandSelection[id];
    }
    return { ...state, brandSelection };
  })
  .handleAction(actions.toggleRecommendedBrandSelected, (state, action) => {
    const brandSelection = { ...state.brandSelection };
    const { id, selected } = action.payload;
    if (selected) {
      if (!brandSelection[id]) {
        brandSelection[id] = { recommended: true };
      }
    } else {
      delete brandSelection[id];
    }
    return { ...state, brandSelection };
  })
  .handleAction(actions.selectAllRecommendedBrands, (state, action) => {
    const selectedBrandIds = action.payload;
    const brandSelection = { ...state.brandSelection };
    for (const key in selectedBrandIds) {
      const brandId = selectedBrandIds[key];
      if (brandId && !brandSelection[brandId]) {
        brandSelection[brandId] = { recommended: true };
      }
    }
    return { ...state, brandSelection };
  })
  .handleAction(actions.deselectAllRecommendedBrands, state => {
    const brandSelection = { ...state.brandSelection };
    Object.keys(brandSelection).forEach(key => {
      if (brandSelection[+key].recommended) {
        delete brandSelection[+key];
      }
    });
    return { ...state, brandSelection };
  })
  .handleAction(actions.setBrandTagFilter, (state, action) => ({
    ...state,
    tagFilter: [...action.payload]
  }))
  .handleAction(actions.setSelectSearchFilter, (state, action) => ({
    ...state,
    selectSearchFilter: action.payload
  }))
  .handleAction(actions.setRequestTemplateText, (state, action) => ({
    ...state,
    requestTemplateText: action.payload
  }))
  .handleAction(actions.setRequestSubject, (state, action) => ({
    ...state,
    requestSubject: action.payload
  }))
  .handleAction(actions.setRecipientStatus, (state, action) => ({
    ...state,
    recipientStatus: {
      ...state.recipientStatus,
      [action.payload.index]: action.payload.status
    }
  }))
  .handleAction(actions.confirmAndSend, state => ({
    ...state,
    status: 'sending'
  }))
  .handleAction(actions.newRequestSent, state => ({
    ...state,
    status: 'sent'
  }))
  .handleAction(actions.newRequestStartSubmission, state => ({
    ...state,
    isProcessing: true
  }))
  .handleAction(actions.newRequestSubmissionSuccess, state => ({
    ...state,
    isProcessing: false
  }))
  .handleAction(actions.newRequestSubmissionError, state => ({
    ...state,
    isProcessing: false
  }))
  .handleAction(actions.newRequestDone, state => ({
    ...initialNewRequestState,
    tags: state.tags
  }))
  .handleAction(actions.cancelNewRequest, state => ({
    ...initialNewRequestState,
    tags: state.tags
  }))
  .handleAction(actions.browserHistoryConsent, (state, action) => ({
    ...state,
    browserHistory: {
      ...state.browserHistory,
      consent: action.payload.consent,
      period: action.payload.period
    }
  }))
  .handleAction(actions.startFetchingBrowserHistory, state => ({
    ...state,
    browserHistory: { ...state.browserHistory, isFetching: true }
  }))
  .handleAction(actions.stopFetchingBrowserHistory, state => ({
    ...state,
    browserHistory: { ...state.browserHistory, isFetching: false }
  }))
  .handleAction(actions.setBrowserHistory, (state, action) => ({
    ...state,
    browserHistory: {
      ...state.browserHistory,
      browserHistoryData: action.payload
    }
  }))
  .handleAction(actions.resetBrowserHistory, (state, action) => ({
    ...state,
    browserHistory: {
      ...initialNewRequestState.browserHistory
    }
  }));
