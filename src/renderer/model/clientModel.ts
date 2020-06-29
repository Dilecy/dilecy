import { AuthenticationQuestion, ConsentAction } from './serverModel';
import { SealedPassword } from '../core/crypto/interface';

export interface Profile {
  id: number;
  profileName: string;
  passwordHash: string;
  encryptionKey: string;
}

export type GetProfiles = () => Promise<Profile[]>;

export type GetProfileCreatedDate = () => Promise<string | undefined>;

export interface EmailAccount {
  emailAddress: string;
  isPrimary: boolean;
  smtp: string;
  smtpPort: number;
  smtpUser: string;
  encyptedPassword: string;

  isGoogle?: boolean;
  refreshToken?: string;
}

export interface ProfileDetails {
  id: number;
  profileName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  streetName: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  emailAccounts: EmailAccount[];
  lastLogin?: string;
  rating?: number;
  ratingId?: number;
  ratingPassword?: string;
}

export interface ProfileCreate {
  profileName: string;
  emailAccounts: EmailAccount[];
}

export interface ProfileWithDetails {
  profile: Profile;
  profileDetails: ProfileDetails;
}

export type CreateProfile = (
  sealedPassword: SealedPassword,
  encryptionKey: string,
  profileDetails: ProfileCreate
) => Promise<ProfileWithDetails>;

export type GetProfileDetails = (
  profile: Profile,
  sealedPassword: SealedPassword
) => Promise<ProfileDetails | undefined>;

export type UpdateProfile = (
  profile: Profile,
  profileDetatils: Partial<ProfileDetails>
) => Promise<ProfileWithDetails>;

export type DeleteProfile = (profile: Profile) => Promise<void>;

export interface ConsentStatus {
  tracking: string | undefined;
  ux_research: string | undefined;
}

export interface AppData {
  version: string;
}

export type GetConsentStatus = () => Promise<ConsentStatus>;

export type GetTrackingId = () => Promise<string | undefined>;

export type StoreConsentActions = (actions: ConsentAction[]) => Promise<void>;

export type ChangeProfilePassword = (
  profile: Profile,
  oldPassword: SealedPassword,
  newPassword: SealedPassword
) => Promise<ProfileWithDetails>;

export type RequestGroupState =
  | 'processing'
  | 'complaint'
  | 'completed'
  | 'canceled';

export type RequestGroupDataStatus = 'pending' | 'received' | 'missing';

export type RequestGroupType =
  | 'access'
  | 'deletion'
  | 'rejection'
  | 'portability';

export interface RequestGroup {
  id: number;
  brandId: number;
  requestGroupType: RequestGroupType;
  dateTimeCreated: string;
  dateTimeRefreshed: string;
  dateTimeSnoozed?: string;
  state: RequestGroupState;
  dataStatus: RequestGroupDataStatus;
  brandName: string;
  companyName: string;
}

export type GetRequestGroups = () => Promise<RequestGroup[]>;
export type UpdateRequestGroup = (group: RequestGroup) => Promise<void>;
export type CreateRequestGroup = (
  group: Partial<RequestGroup>
) => Promise<RequestGroup>;

export type RequestType = 'data' | 'reminder' | 'complain';

export interface EmailRequest {
  id: number;
  requestGroupId: number;
  requestType: RequestType;
  inCreation: boolean;
  dateTimeSent?: string;
  messageId?: string;
  // Copy e-mail (as .eml file)
  from: string;
  to: string;
  subject: string;
  text: string;
}

export type GetEmailRequests = () => Promise<EmailRequest[]>;
export type UpdateEmailRequest = (request: EmailRequest) => Promise<void>;
export type CreateEmailRequest = (
  request: Partial<EmailRequest>
) => Promise<EmailRequest>;

export interface AuthenticationAnswer extends AuthenticationQuestion {
  // idOnServer: number; // Do we need this? We could just use same id locally
  answer: string;
}

export type GetAuthenticationAnswers = () => Promise<AuthenticationAnswer[]>;

export type StoreAuthenticationAnswers = (
  answers: AuthenticationAnswer[]
) => Promise<void>;

export type CheckDbCompatibility = (
  profile?: Profile,
  sealedPassword?: SealedPassword
) => Promise<boolean>;

export type GetAppData = () => Promise<AppData[]>;
export type InsertAppData = (appData: AppData) => Promise<AppData>;

export interface ClientBackend {
  getProfileDetails: GetProfileDetails;
  getProfiles: GetProfiles;
  getProfileCreatedDate: GetProfileCreatedDate;
  createProfile: CreateProfile;
  updateProfile: UpdateProfile;
  deleteProfile: DeleteProfile;
  changeProfilePassword: ChangeProfilePassword;
  getConsentStatus: GetConsentStatus;
  getTrackingId: GetTrackingId;
  storeConsentActions: StoreConsentActions;
  getRequestGroups: GetRequestGroups;
  updateRequestGroup: UpdateRequestGroup;
  createRequestGroup: CreateRequestGroup;
  getEmailRequests: GetEmailRequests;
  updateEmailRequest: UpdateEmailRequest;
  createEmailRequest: CreateEmailRequest;
  checkDbCompatibility: CheckDbCompatibility;
  getAppData: GetAppData;
  insertAppData: InsertAppData;
  // getAuthentificationAnswers: GetAuthenticationAnswers;
  // storeAuthentificationAnswers: StoreAuthenticationAnswers;
}
