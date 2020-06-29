import { createAction } from 'typesafe-actions';
import { RequestPageSelection, SendStatus } from '../../store/stateModel';
import { RequestGroupType } from '../../model/clientModel';
import { BrowserHistory } from 'node-browser-history';
import {
  MissingBrand,
  EmailTemplate,
  Brand,
  Tag
} from '../../model/serverModel';
import { IdMap, HashMap } from '../../store/util/types';
import { BrandsResponse } from './interfaces/brand';

export const selectNewRequestStep = createAction(
  '[New Request] Select New Request Step'
)<RequestPageSelection>();
export const validateNewRequestStep = createAction(
  '[New Request] Validate New Request Step'
)<Partial<Record<RequestPageSelection, boolean>>>();
export const cancelNewRequest = createAction('[New Request] Cance New Request')<
  void
>();
export const selectRequestType = createAction(
  '[New Request] Select Request Type'
)<RequestGroupType>();

export const setBrandTagFilter = createAction(
  '[New Request] Set Brand Tag Filter'
)<number[]>();

export const toggleBrandSelected = createAction(
  '[Brands Select Step] Toggle Brand Selected'
)<{ id: number; selected: boolean }>();

export const toggleRecommendedBrandSelected = createAction(
  '[Recommended Brands Step] Toggle Selected'
)<{ id: number; selected: boolean }>();

export const selectAllRecommendedBrands = createAction(
  '[Recommended Brands Step] Select All'
)<(number | undefined)[]>();

export const deselectAllRecommendedBrands = createAction(
  '[Recommended Brands Step] Deselect All'
)<void>();

export const setSelectSearchFilter = createAction(
  '[New Request] Set Select Search Filter'
)<string>();

export const setRequestSubject = createAction(
  '[New Request] Set Request Subject'
)<string>();
export const setRequestTemplateText = createAction(
  '[New Request] Set Request Template Text'
)<string>();

export const setAuthAnswerText = createAction(
  '[New Request] Set Auth Answer Text'
)<{
  id: number;
  text: string;
}>();
export const setRecipientStatus = createAction(
  '[New Request] Set Recipient Status'
)<{
  index: number;
  status: SendStatus;
}>();

export const confirmAndSend = createAction('[New Request] Confirm and Send')<
  void
>();
export const newRequestStartSubmission = createAction(
  '[New Request] Start Submission'
)<void>();
export const newRequestSubmissionSuccess = createAction(
  '[New Request] Submission Success'
)<void>();
export const newRequestSubmissionError = createAction(
  '[New Request] Submission Error'
)<void>();
export const newRequestSent = createAction('[New Request] New Request Sent')<
  void
>();
export const newRequestDone = createAction('[New Request] New Request Done')<
  void
>();
export const resetBrowserHistory = createAction(
  '[New Request] Reset Browser History'
)();
export const setBrowserHistory = createAction(
  '[New Request] Set Browser History'
)<BrowserHistory[]>();
export const startFetchingBrowserHistory = createAction(
  '[New Request] Start Fetching Browser History'
)<void>();
export const stopFetchingBrowserHistory = createAction(
  '[New Request] Stop Fetching Browser History'
)<void>();
export const browserHistoryConsent = createAction(
  '[New Request] Browser History Consent'
)<{
  consent: boolean;
  period: number;
}>();

export const addMissingBrand = createAction('[New Request] Add Missing Brand')<
  MissingBrand
>();

// brands action creators
export const brandsRequested = createAction('[New Request] Brands Requested')<{
  pageNumber: number;
  autocompleteText?: string;
  tagIds?: number[];
}>();
export const brandsReceived = createAction('[New Request] Brands Received')<
  BrandsResponse
>();
export const brandsRequestFailed = createAction(
  '[New Request] Brand Request Failed'
)<void>();
export const brandsCleared = createAction('[New Request] Brands Cleared')<
  void
>();
export const recommendedBrandsRequested = createAction(
  '[New Request] Recommended Brands Requested'
)<void>();
export const recommendedBrandsReceived = createAction(
  '[New Request] Recommended Brands Received'
)<IdMap<Brand>>();
export const recommendedBrandsRequestFailed = createAction(
  '[New Request] Recommended Brands Request Failed'
)<void>();

// tags action creators
export const tagsRequested = createAction('[New Request] Tags Requested')<
  void
>();
export const tagsReceived = createAction('[New Request] Tags Received')<
  IdMap<Tag>
>();
export const tagsRequestFailed = createAction(
  '[New Request] Tag Request Failed'
)<void>();

//email template action creators
export const emailTemplatesRequested = createAction(
  '[New Request] Email Templates Requested'
)<number>();
export const emailTemplatesReceived = createAction(
  '[New Request] Email Templates Received'
)<HashMap<EmailTemplate>>();
export const emailTemplatesRequestFailed = createAction(
  '[New Request] Email Templates Request Failed'
)();
