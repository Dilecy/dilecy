import * as SM from '../model/serverModel';
import * as CM from '../model/clientModel';
import { IdMap, IdSet, HashMap } from './util/types';
import { BrowserHistory } from 'node-browser-history';

export type AppInfo = {
  version: string;
  versionSuffix?: string;
};

export type ViewSelection =
  | 'login'
  | 'settings'
  | 'home'
  | 'newRequest'
  | 'oldRequests'
  | 'help';

export type LoginPageSelection = 'login' | 'createProfile';
export type RequestPageSelection =
  | 'choose'
  | 'recommendation'
  | 'select'
  | 'text'
  | 'summary';

export type PageSelection = {
  login: LoginPageSelection;
  newRequest: RequestPageSelection;
};

export type LoggedInStatus = {
  profile: CM.Profile;
  profileDetails: CM.ProfileDetails;
};

// Login status
export type LoginStatus = {
  loggedIn?: LoggedInStatus;
  profiles: CM.Profile[];
  blocked: boolean;
};

export type ConsentStatus = CM.ConsentStatus;
export type CreateProfileStatus = {
  activeStep: string;

  profileData: CreateProfileData;
};

export type CreateProfileData = {
  tracking?: boolean | undefined;
  ux_research?: boolean | undefined;
  accept_terms?: boolean | undefined;
  emailAddress?: string | undefined;
  emailPassword?: string | undefined;
  smtp?: string | undefined;
  smtpPort?: number | undefined;
  smtpUser?: string | undefined;
  profileName?: string | undefined;
  password?: string | undefined;
  password2?: string | undefined;
  isGoogle?: boolean | undefined;
  refreshToken?: string | undefined;
};

// ClientData
export type ClientData = {
  requestGroup: IdMap<CM.RequestGroup>;
  emailRequest: IdMap<CM.EmailRequest>;
  authA: IdMap<CM.AuthenticationAnswer>;
};

export type Recommends = IdSet;
// ServerData
export type ServerData = {
  domain: HashMap<SM.Domain>;
};

// Home
export type HomeState = {
  updateInfo: Partial<SM.UpdateInfo>;
  showRatingMessage: boolean;
  showFeedbackMessage: boolean;
};

// NewRequest
export type BrandSelection = IdMap<{ recommended: boolean }>;
export type BrandSearchFilter = string;
export type BrandList = SM.Brand[];
export type AuthQAItem = {
  authA: CM.AuthenticationAnswer;
  brandNames: string[];
};
export type AuthQAList = AuthQAItem[];
export type SendStatus = 'selected' | 'prepared' | 'sent';
export interface Recipient {
  brand: SM.Brand;
  status: SendStatus;
}

export type BrowserHistoryState = {
  consent: boolean;
  period: number;
  browserHistoryData: BrowserHistory[];
  isFetching: boolean;
};
export type RecipientStatus = IdMap<SendStatus>;
export type NewRequestStatus = 'creating' | 'sending' | 'sent';

export type BrandsById = IdMap<SM.Brand>;
export interface BrandsState {
  loading: boolean;
  totalCount: number;
  paginatedBrands: PaginatedBrands;
  currentPage: number;
  brandsById: BrandsById;
}
export type PaginatedBrands = {
  brandsByPageNumber: IdMap<SM.Brand[]>;
  hasMore: boolean;
};
export interface EmailTemplatesState {
  hasMore: boolean;
  loading: boolean;
  emailTemplatesList: HashMap<SM.EmailTemplate>;
}
export type NewRequestState = {
  activeStep: RequestPageSelection;
  validSteps: Record<RequestPageSelection, boolean>;
  browserHistory: BrowserHistoryState;
  requestType: CM.RequestGroupType;
  brandSelection: BrandSelection;
  brands: BrandsState;
  recommendedBrands: IdMap<SM.Brand>;
  tags: IdMap<SM.Tag>;
  emailTemplates: EmailTemplatesState;
  tagFilter: number[];
  selectSearchFilter: BrandSearchFilter;
  requestTemplateText: string;
  requestSubject: string;
  recipientStatus: RecipientStatus;
  isProcessing: boolean;
  status: NewRequestStatus;
};

export type RequestSearchFilter = string;
export interface RequestGroupListItem extends CM.RequestGroup {
  elapsedTime: number;
}
export type OldRequestsState = {
  oldRequests: IdMap<CM.RequestGroup>;
  byId: number[];
  loading: boolean;
};
